"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useEffect,
} from "react";
import questions, { Question } from "@/data/questions";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Screen =
  | "start"
  | "rules"
  | "question"
  | "face_off"
  | "play_or_pass"
  | "board"
  | "steal"
  | "revealing"
  | "end_round"
  | "end";

export type Team = "teamA" | "teamB";

export type FaceOffAnswer = {
  team: Team;
  answerIndex: number | null;
  points: number;
};

export type FaceOffState = {
  activeBuzzer: Team | null;
  answers: FaceOffAnswer[];
  winner: Team | null;
};

export type GameState = {
  screen: Screen;
  questionIndex: number;
  revealed: number[];
  scores: { teamA: number; teamB: number };
  strikes: number;
  turn: Team;
  roundPoints: number;
  stealing: boolean;
  stealTeam: Team | null;
  scoreWinner: Team | null; // who gets roundPoints at end of round
  faceOff: FaceOffState;
  questions: Question[];
};

export type GameAction =
  | { type: "START_GAME" }
  | { type: "START_QUESTIONS" }
  | { type: "SHOW_BOARD" }
  // Face-off
  | { type: "FACE_OFF_BUZZ"; payload: Team }
  | { type: "FACE_OFF_ANSWER_CORRECT"; payload: { index: number; points: number } }
  | { type: "FACE_OFF_ANSWER_WRONG" }
  // Play or Pass
  | { type: "PLAY" }
  | { type: "PASS" }
  // Board
  | { type: "REVEAL_ANSWER"; payload: { index: number; points: number } }
  | { type: "REVEAL_ANSWER_DISPLAY"; payload: { index: number } }
  | { type: "ADD_STRIKE" }
  // Steal
  | { type: "STEAL_SUCCESS"; payload: { index: number; points: number } }
  | { type: "STEAL_FAIL" }
  // Navigation
  | { type: "START_REVEALING" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_GAME" };

export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentQuestion: Question | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function opposite(team: Team): Team {
  return team === "teamA" ? "teamB" : "teamA";
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialFaceOff: FaceOffState = {
  activeBuzzer: null,
  answers: [],
  winner: null,
};

const initialState: GameState = {
  screen: "start",
  questionIndex: 0,
  revealed: [],
  scores: { teamA: 0, teamB: 0 },
  strikes: 0,
  turn: "teamA",
  roundPoints: 0,
  stealing: false,
  stealTeam: null,
  scoreWinner: null,
  faceOff: initialFaceOff,
  questions,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "START_GAME":
      return { ...initialState, screen: "rules" };

    case "START_QUESTIONS":
      return { ...state, screen: "question" };

    case "SHOW_BOARD":
      return {
        ...state,
        screen: "face_off",
        strikes: 0,
        roundPoints: 0,
        revealed: [],
        stealing: false,
        stealTeam: null,
        scoreWinner: null,
        faceOff: initialFaceOff,
      };

    // ── Face-off ──────────────────────────────────────────────────────────────

    case "FACE_OFF_BUZZ": {
      const { faceOff } = state;
      const team = action.payload;
      if (faceOff.activeBuzzer !== null) return state;
      if (faceOff.answers.some((a) => a.team === team)) return state;
      return { ...state, faceOff: { ...faceOff, activeBuzzer: team } };
    }

    case "FACE_OFF_ANSWER_CORRECT": {
      const { faceOff } = state;
      const team = faceOff.activeBuzzer;
      if (!team) return state;

      const newAnswer: FaceOffAnswer = {
        team,
        answerIndex: action.payload.index,
        points: action.payload.points,
      };
      const newAnswers = [...faceOff.answers, newAnswer];
      const newRevealed = [...state.revealed, action.payload.index];
      const newRoundPoints = state.roundPoints + action.payload.points;

      if (newAnswer.answerIndex === 0) {
        const winner = newAnswer.team;
        return {
          ...state,
          revealed: newRevealed,
          roundPoints: newRoundPoints,
          faceOff: { ...faceOff, activeBuzzer: null, answers: newAnswers, winner },
          screen: "play_or_pass",
          turn: winner,
        };
      }

      if (newAnswers.length === 2) {
        const [first, second] = newAnswers;
        const winner = second.points > first.points ? second.team : first.team;
        return {
          ...state,
          revealed: newRevealed,
          roundPoints: newRoundPoints,
          faceOff: { ...faceOff, activeBuzzer: null, answers: newAnswers, winner },
          screen: "play_or_pass",
          turn: winner,
        };
      }

      return {
        ...state,
        revealed: newRevealed,
        roundPoints: newRoundPoints,
        faceOff: { ...faceOff, activeBuzzer: null, answers: newAnswers, winner: null },
      };
    }

    case "FACE_OFF_ANSWER_WRONG": {
      const { faceOff } = state;
      const team = faceOff.activeBuzzer;
      if (!team) return state;

      const newAnswer: FaceOffAnswer = { team, answerIndex: null, points: 0 };
      const newAnswers = [...faceOff.answers, newAnswer];

      if (newAnswers.length === 2) {
        const winner = newAnswers[0].team;
        return {
          ...state,
          faceOff: { ...faceOff, activeBuzzer: null, answers: newAnswers, winner },
          screen: "play_or_pass",
          turn: winner,
        };
      }

      return {
        ...state,
        faceOff: { ...faceOff, activeBuzzer: null, answers: newAnswers, winner: null },
      };
    }

    // ── Play or Pass ──────────────────────────────────────────────────────────

    case "PLAY":
      return { ...state, screen: "board", stealTeam: opposite(state.turn) };

    case "PASS":
      return {
        ...state,
        screen: "board",
        stealTeam: state.turn,
        turn: opposite(state.turn),
      };

    // ── Board ─────────────────────────────────────────────────────────────────

    case "REVEAL_ANSWER": {
      const newRevealed = [...state.revealed, action.payload.index];
      const newRoundPoints = state.roundPoints + action.payload.points;
      const total = state.questions[state.questionIndex].answers.length;
      const swept = newRevealed.length === total;

      return {
        ...state,
        revealed: newRevealed,
        roundPoints: newRoundPoints,
        // Board swept: skip end_round, go straight to revealing. Score committed later.
        ...(swept && {
          screen: "revealing" as Screen,
          scoreWinner: state.turn,
        }),
      };
    }

    // Reveal tile visually only — no score impact, used during "revealing" phase
    case "REVEAL_ANSWER_DISPLAY": {
      const { index } = action.payload;
      if (state.revealed.includes(index)) return state;
      return { ...state, revealed: [...state.revealed, index] };
    }

    case "ADD_STRIKE": {
      const newStrikes = state.strikes + 1;
      if (newStrikes >= 3) {
        // Goes to "steal" screen — BoardScreen Enter-gates the StealOverlay
        return { ...state, strikes: newStrikes, screen: "steal", stealing: true };
      }
      return { ...state, strikes: newStrikes };
    }

    // ── Steal ─────────────────────────────────────────────────────────────────

    case "STEAL_SUCCESS": {
      const newRevealed = [...state.revealed, action.payload.index];
      const newRoundPoints = state.roundPoints + action.payload.points;
      const winner = state.stealTeam ?? opposite(state.turn);
      const total = state.questions[state.questionIndex].answers.length;
      const boardCleared = newRevealed.length >= total;
      return {
        ...state,
        screen: boardCleared ? "revealing" : "end_round",
        revealed: newRevealed,
        roundPoints: newRoundPoints,
        stealing: false,
        scoreWinner: winner,
      };
    }

    case "STEAL_FAIL": {
      const total = state.questions[state.questionIndex].answers.length;
      const boardCleared = state.revealed.length >= total;
      return {
        ...state,
        screen: boardCleared ? "revealing" : "end_round",
        stealing: false,
        scoreWinner: state.turn,
      };
    }

    // ── Revealing ─────────────────────────────────────────────────────────────

    case "START_REVEALING":
      return { ...state, screen: "revealing" };

    // ── Round / Game end ──────────────────────────────────────────────────────

    case "NEXT_QUESTION": {
      const nextIndex = state.questionIndex + 1;
      const winner = state.scoreWinner;
      const newScores = winner
        ? { ...state.scores, [winner]: state.scores[winner] + state.roundPoints }
        : state.scores;

      if (nextIndex >= state.questions.length) {
        return { ...state, scores: newScores, screen: "end" };
      }
      return {
        ...state,
        scores: newScores,
        screen: "question",
        questionIndex: nextIndex,
        revealed: [],
        strikes: 0,
        roundPoints: 0,
        stealing: false,
        stealTeam: null,
        scoreWinner: null,
        faceOff: initialFaceOff,
        turn: opposite(state.turn),
      };
    }

    case "RESET_GAME":
      return { ...initialState };

    default:
      return state;
  }
}

// ─── localStorage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "blerd-feud-state";

function loadState(): GameState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as GameState;
    return { ...parsed, questions };
  } catch {
    return initialState;
  }
}

function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    const { questions: _q, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch { /* fail silently */ }
}

// ─── Context & Provider ───────────────────────────────────────────────────────

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState);

  const currentQuestion =
    state.questionIndex < state.questions.length
      ? state.questions[state.questionIndex]
      : null;

  useEffect(() => { saveState(state); }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch, currentQuestion }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}