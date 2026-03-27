"use client"
import { createContext, ReactNode, useContext, useReducer } from "react";

type GameState = {
  screen: "start" | "question" | "board" | "end";
  questionIndex: number;
  revealed: number[];
  scores: {
    teamA: number;
    teamB: number;
  };
  strikes: number;
  turn: "teamA" | "teamB";
};

type GameAction =
  | { type: "START_GAME" }
  | { type: "REVEAL_ANSWER"; payload: number }
  | { type: "ADD_SCORE"; payload: number }
  | { type: "NEXT_QUESTION" }
  | { type: "SWITCH_TURN" }
  | { type: "ADD_STRIKE" }
  | { type: "RESET_GAME" };

  type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | null>(null);

const initialState: GameState = {
  screen: "start",
  questionIndex: 0,
  revealed: [],
  scores: { teamA: 0, teamB: 0 },
  strikes: 0,
  turn: "teamA",
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...state, screen: "question" };

    case "REVEAL_ANSWER":
      return {
        ...state,
        revealed: [...state.revealed, action.payload],
      };

    case "ADD_SCORE":
      return {
        ...state,
        scores: {
          ...state.scores,
          [state.turn]: state.scores[state.turn] + action.payload,
        },
      };

    case "ADD_STRIKE":
      return {
        ...state,
        strikes: state.strikes + 1,
      };

    case "SWITCH_TURN":
      return {
        ...state,
        turn: state.turn === "teamA" ? "teamB" : "teamA",
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        revealed: [],
        strikes: 0,
      };

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);