"use client";

import { useGame } from "@/context/GameContext";

export default function EndScreen() {
  const { state, dispatch } = useGame();
  const { teamA, teamB } = state.scores;

  const winner =
    teamA > teamB ? "TEAM A WINS! 🏆" :
    teamB > teamA ? "TEAM B WINS! 🏆" :
    "IT'S A TIE! 🤝";

  return (
    <div className="fixed top-0 flex flex-col flex-1 items-center justify-center font-barlow h-full w-full dotted gap-10">
      <div className="font-barlow-condensed font-[900] text-7xl text-black text-center drop-shadow-lg">
        {winner}
      </div>
      <div className="flex flex-row gap-16">
        {[
          { label: "TEAM A", score: teamA, winning: teamA >= teamB },
          { label: "TEAM B", score: teamB, winning: teamB >= teamA },
        ].map(({ label, score, winning }) => (
          <div key={label} className={`flex flex-col items-center px-10 py-6 border-[6px] ${winning ? "border-black bg-black text-white" : "border-black bg-white text-black"}`}>
            <div className="font-barlow-condensed font-[700] text-3xl">{label}</div>
            <div className="font-space-mono font-[700] text-6xl mt-2">{score.toString().padStart(3, "0")}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => dispatch({ type: "RESET_GAME" })}
        className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all duration-200 font-space-mono font-[700] text-2xl bg-black text-white px-8 py-3"
      >
        PLAY AGAIN →
      </button>
    </div>
  );
}