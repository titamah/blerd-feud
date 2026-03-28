"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import Lives from "@/components/Lives";
import BuzzToast from "@/components/BuzzToast";
import StealOverlay from "@/components/StealOverlay";
import EndRoundOverlay from "@/components/EndRoundOverlay";
import { useGame } from "@/context/GameContext";

interface Toast { id: number }

export default function BoardScreen() {
  const { state, dispatch } = useGame();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const isEndRound = state.screen === "end_round";
  const isSteal = state.screen === "steal";

  const triggerBuzzer = () => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyX" && state.screen === "board"){
        triggerBuzzer();
        dispatch({ type: "ADD_STRIKE" });
      } else if (e.code === "KeyX" && state.screen === "steal") {
        triggerBuzzer();
        dispatch({ type: "STEAL_FAIL" });
      }
    };


    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.screen, dispatch]);

  const playingLabel = isSteal
    ? `STEALING: ${state.stealTeam === "teamA" ? "TEAM A" : "TEAM B"}`
    : `PLAYING: ${state.turn === "teamA" ? "TEAM A" : "TEAM B"}`;

  return (
    <div className="fixed top-0 flex flex-col flex-1 gap-4 items-center justify-center font-barlow h-full w-full dotted">
      <div className="w-[85%] max-w-[1048px] flex flex-row items-center h-[56px]">
        <div className="w-[33%] font-barlow-condensed font-[700] text-4xl text-black p-2 px-4">
          {playingLabel}
        </div>
        <div className="w-[33%] flex justify-center">
          <div className="font-space-mono font-[700] text-4xl text-white bg-black p-2 px-4">
            {state.roundPoints.toString().padStart(3, "0")}
          </div>
        </div>
        <Lives count={Math.max(0, 3 - state.strikes)} active={true} />
      </div>

      <SurveyBoard />

      <div className="w-[85%] max-w-[1048px] flex flex-row justify-between">
        <Nameplate name="Team A" score={state.scores.teamA} />
        <Nameplate name="Team B" score={state.scores.teamB} />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[500000] flex items-center justify-center">
        <AnimatePresence>
          {toasts.map((toast) => <BuzzToast key={toast.id} />)}
        </AnimatePresence>
      </div>

      {isSteal && <StealOverlay />}
      {isEndRound && <EndRoundOverlay />}
    </div>
  );
}