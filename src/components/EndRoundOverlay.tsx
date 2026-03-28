"use client";

import { useGame } from "@/context/GameContext";

type Props = {
  onReveal: () => void;
};

export default function EndRoundOverlay({ onReveal }: Props) {
  const { state } = useGame();

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center gap-8 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-12 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-6xl text-center">
            {state.turn == "teamA" ? "TEAM A WINS!" : "TEAM B WINS!"}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="font-barlow-condensed font-[700] text-white text-2xl">
          POINTS THIS ROUND
          </div>
          <div className="font-space-mono font-[700] text-white text-6xl">
            {state.roundPoints.toString().padStart(3, "0")}
          </div>
        </div>

        <button
          onClick={onReveal}
          className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-black text-white px-8 py-3 w-full text-center"
        >
          REVEAL ANSWERS →
        </button>
      </div>
    </div>
  );
}