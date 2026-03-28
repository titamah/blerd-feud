"use client";

import { useState } from "react";
import { useGame, opposite } from "@/context/GameContext";

export default function StealOverlay() {
  const { state, dispatch } = useGame();
  const [dismissed, setDismissed] = useState(false);

  const stealTeam = state.stealTeam ?? opposite(state.turn);
  const stealLabel = stealTeam === "teamA" ? "TEAM A" : "TEAM B";

  // Once dismissed, board handles the steal click/keypress directly
  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70">
      <div className="flex flex-col items-center gap-6 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-10 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-6xl text-center animate-pulse">
          ⚡ STEAL! ⚡
        </div>

        <div className="font-barlow-condensed font-[700] text-white text-4xl text-center">
          {stealLabel}
        </div>

        <div className="flex flex-col gap-3 w-full items-center">
          <button
            onClick={() => setDismissed(true)}
            className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-lg bg-black text-white px-6 py-3 w-fit text-center"
          >
            PICK AN ANSWER →
          </button>
        </div>
      </div>
    </div>
  );
}