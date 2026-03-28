"use client";

import { useGame } from "@/context/GameContext";
import { motion } from "motion/react";

export default function PlayOrPassOverlay() {
  const { state, dispatch } = useGame();
  const teamLabel = state.turn === "teamA" ? "TEAM A" : "TEAM B";
  const otherLabel = state.turn === "teamA" ? "TEAM B" : "TEAM A";

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70 w-[full] ">
        <motion.div
      initial={{ scale: 0, opacity: 0, }}
      animate={{ scale: 1, opacity: 1, }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: "spring", stiffness: 260, damping: 20,
        rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      }} className="flex flex-col items-center gap-8 bg-[#FF00B3] border-[8px] border-[#ff86d6] rounded-3xl p-12 max-w-lg w-full mx-4">
        <div className="font-barlow-condensed font-[900] text-white text-5xl text-center leading-tight">
          ⚡️{teamLabel}⚡️
          <br />
          <span className="text-4xl font-[700]">PASS OR PLAY?</span>
        </div>

        <div className="flex flex-row gap-6 w-full justify-center">
          <button
            onClick={() => dispatch({ type: "PASS" })}
            className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-white text-black border-[4px] border-black px-8 py-4 flex-1"
          >
            PASS
          </button>
          <button
            onClick={() => dispatch({ type: "PLAY" })}
            className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all font-space-mono font-[700] text-2xl bg-black text-white px-8 py-4 flex-1"
          >
            PLAY
          </button>
        </div>
    </motion.div>
      </div>
  );
}