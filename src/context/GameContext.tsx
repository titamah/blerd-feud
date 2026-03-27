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
  | "question"
  | "face_off"
  | "play_or_pass"
  | "board"
  | "steal"
  | "end_round"
  | "end";

export type Team = "teamA" | "teamB";

export type FaceOffState = {
  buzzedTeam: Team | null;
  firstAnswerCorrect: boolean | null;
  secondBuzzedTeam: Team | null;
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
  faceOff: FaceOffState;
  questions: Question[];
};

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SHOW_BOARD" }
  | { type: "FACE_OFF_BUZZ"; payload: Team }
  | { type: "FACE_OFF_CORRECT" }
  | { type: "FACE_OFF_WRONG" }
  | { type: "FACE_OFF_ASSIGN"; payload: Team }
  | { type: "PLAY" }
  | { type: "PASS" }
  | { type: "REVEAL_ANSWER"; payload: { index: number; points: number } }
  | { type: "REVEAL_ALL" }
  | { type: "ADD_STRIKE" }
  | { type: "STEAL_SUCCESS"; payload: { index: number; points: number } }
  | { type: "STEAL_FAIL" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET_GAME" };

export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  currentQuestion: Question | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function opposite(team: Team): Team {
  return team === "teamA" ? "teamB" : "teamA";
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialFaceOff: FaceOffState = {
  buzzedTeam: null,
  firstAnswerCorrect: null,
  secondBuzzedTeam: null,
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
  faceOff: initialFaceOff,
  questions,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "START_GAME":
      return { ...initialState, screen: "question" };

    case "SHOW_BOARD":
      return {
        ...state,
        screen: "face_off",
        strikes: 0,
        roundPoints: 0,
        revealed: [],
        stealing: false,
        stealTeam: null,
        faceOff: initialFaceOff,
      };

    // ── Face-off ──────────────────────────────────────────────────────────────

    case "FACE_OFF_BUZZ": {
      const { faceOff } = state;
      if (!faceOff.buzzedTeam) {
        return { ...state, faceOff: { ...faceOff, buzzedTeam: action.payload } };
      }
      // Only allow second buzz if first answer was ruled wrong
      if (faceOff.firstAnswerCorrect === false && !faceOff.secondBuzzedTeam
          && action.payload !== faceOff.buzzedTeam) {
        return { ...state, faceOff: { ...faceOff, secondBuzzedTeam: action.payload } };
      }
      return state;
    }

    case "FACE_OFF_CORRECT": {
      const winner = state.faceOff.buzzedTeam ?? "teamA";
      return {
        ...state,
        screen: "play_or_pass",
        turn: winner,
        faceOff: { ...state.faceOff, firstAnswerCorrect: true },
      };
    }

    case "FACE_OFF_WRONG": {
      const { faceOff } = state;
      // First team got it wrong — wait for second buzz
      if (!faceOff.secondBuzzedTeam) {
        return { ...state, faceOff: { ...faceOff, firstAnswerCorrect: false } };
      }
      // Both answered — second buzzer wins
      return {
        ...state,
        screen: "play_or_pass",
        turn: faceOff.secondBuzzedTeam,
        faceOff: { ...faceOff, firstAnswerCorrect: false },
      };
    }

    case "FACE_OFF_ASSIGN":
      return { ...state, screen: "play_or_pass", turn: action.payload };

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
        ...(swept && {
          screen: "end_round" as Screen,
          scores: {
            ...state.scores,
            [state.turn]: state.scores[state.turn] + newRoundPoints,
          },
        }),
      };
    }

    case "REVEAL_ALL": {
      const total = state.questions[state.questionIndex].answers.length;
      return {
        ...state,
        revealed: Array.from({ length: total }, (_, i) => i),
      };
    }

    case "ADD_STRIKE": {
      const newStrikes = state.strikes + 1;
      if (newStrikes >= 3) {
        return { ...state, strikes: newStrikes, screen: "steal", stealing: true };
      }
      return { ...state, strikes: newStrikes };
    }

    // ── Steal ─────────────────────────────────────────────────────────────────

    case "STEAL_SUCCESS": {
      const newRevealed = [...state.revealed, action.payload.index];
      const newRoundPoints = state.roundPoints + action.payload.points;
      const winner = state.stealTeam ?? opposite(state.turn);
      return {
        ...state,
        screen: "end_round",
        revealed: newRevealed,
        roundPoints: newRoundPoints,
        stealing: false,
        scores: {
          ...state.scores,
          [winner]: state.scores[winner] + newRoundPoints,
        },
      };
    }

    case "STEAL_FAIL":
      return {
        ...state,
        screen: "end_round",
        stealing: false,
        scores: {
          ...state.scores,
          [state.turn]: state.scores[state.turn] + state.roundPoints,
        },
      };

    // ── Round / Game end ──────────────────────────────────────────────────────

    case "NEXT_QUESTION": {
      const nextIndex = state.questionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, screen: "end" };
      }
      return {
        ...state,
        screen: "question",
        questionIndex: nextIndex,
        revealed: [],
        strikes: 0,
        roundPoints: 0,
        stealing: false,
        stealTeam: null,
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