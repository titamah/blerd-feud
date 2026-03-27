"use client";

import { useGame } from "@/context/GameContext";

export default function StealOverlay() {
  const { state, dispatch } = useGame();
  const stealTeam = state.stealTeam ?? (state.turn === "teamA" ? "teamB" : "teamA");
  const stealLabel = stealTeam === "teamA" ? "TEAM A" : "TEAM B";

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center gap-6 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-10 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-6xl text-center animate-pulse">
          ⚡ STEAL! ⚡
        </div>

        <div className="font-barlow-condensed font-[700] text-white text-4xl text-center">
          {stealLabel}
        </div>

        <p className="font-space-mono text-white text-center text-base opacity-90">
          One answer. Make it count.
          <br />
          <span className="opacity-70 text-sm">
            Close this and click an answer on the board, or press its number key.
          </span>
        </p>

        <div className="flex flex-row gap-4 w-full">
          <button
            onClick={() => dispatch({ type: "STEAL_FAIL" })}
            className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-lg bg-black text-white px-6 py-3 flex-1"
          >
            WRONG ANSWER →<br />
            <span className="text-sm font-[400] opacity-70">pass points to other team</span>
          </button>
          <button
            onClick={() => {/* just close overlay — clicking board handles STEAL_SUCCESS */}}
            className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-lg bg-white text-black border-[4px] border-black px-6 py-3 flex-1"
          >
            PICK AN ANSWER →<br />
            <span className="text-sm font-[400] opacity-70">close & click the board</span>
          </button>
        </div>
      </div>
    </div>
  );
}