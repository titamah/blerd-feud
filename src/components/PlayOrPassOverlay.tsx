"use client";

import { useGame } from "@/context/GameContext";

export default function PlayOrPassOverlay() {
  const { state, dispatch } = useGame();
  const teamLabel = state.turn === "teamA" ? "TEAM A" : "TEAM B";
  const otherLabel = state.turn === "teamA" ? "TEAM B" : "TEAM A";

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center gap-8 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-12 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-5xl text-center leading-tight">
          {teamLabel}
          <br />
          <span className="text-4xl font-[700]">PLAY OR PASS?</span>
        </div>

        <p className="font-space-mono text-white text-center text-base opacity-90">
          PLAY — {teamLabel} takes the board.
          <br />
          PASS — {otherLabel} takes the board.
          <br />
          <span className="opacity-70 text-sm">
            (If you pass and they get 3 strikes, you get the steal.)
          </span>
        </p>

        <div className="flex flex-row gap-6 w-full justify-center">
          <button
            onClick={() => dispatch({ type: "PLAY" })}
            className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-black text-white px-8 py-4 flex-1"
          >
            PLAY
          </button>
          <button
            onClick={() => dispatch({ type: "PASS" })}
            className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-white text-black border-[4px] border-black px-8 py-4 flex-1"
          >
            PASS
          </button>
        </div>
      </div>
    </div>
  );
}