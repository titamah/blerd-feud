"use client";

import { useGame } from "@/context/GameContext";

export default function NextRoundOverlay() {
  const { state, dispatch } = useGame();
  const isLastQuestion = state.questionIndex >= state.questions.length - 1;

  // Show projected scores — roundPoints haven't been committed yet
  const winner = state.scoreWinner;
  const projectedScores = {
    teamA: state.scores.teamA + (winner === "teamA" ? state.roundPoints : 0),
    teamB: state.scores.teamB + (winner === "teamB" ? state.roundPoints : 0),
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center gap-8 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-12 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-6xl text-center">
          {isLastQuestion ? "GAME OVER!" : "NEXT ROUND!"}
        </div>

        <div className="flex flex-row gap-8 w-full justify-around">
          <div className="flex flex-col items-center">
            <div className="font-barlow-condensed font-[700] text-white text-2xl">TEAM A</div>
            <div className="font-space-mono font-[700] text-white text-5xl mt-1">
              {projectedScores.teamA.toString().padStart(3, "0")}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-barlow-condensed font-[700] text-white text-2xl">TEAM B</div>
            <div className="font-space-mono font-[700] text-white text-5xl mt-1">
              {projectedScores.teamB.toString().padStart(3, "0")}
            </div>
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-black text-white px-8 py-3 w-full text-center"
        >
          {isLastQuestion ? "SEE FINAL RESULTS →" : "NEXT ROUND →"}
        </button>
      </div>
    </div>
  );
}