"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import Lives from "@/components/Lives";
import BuzzToast from "@/components/BuzzToast";
import StealOverlay from "@/components/StealOverlay";
import EndRoundOverlay from "@/components/EndRoundOverlay";
import NextRoundOverlay from "@/components/NextRoundOverlay";
import EnterToContinue from "@/components/EnterToContinue";
import { useGame } from "@/context/GameContext";

interface Toast { id: number }

export default function BoardScreen() {
  const { state, dispatch } = useGame();
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Enter-gate local state for each modal
  const [stealReady, setStealReady] = useState(false);
  const [endRoundReady, setEndRoundReady] = useState(false);
  const [nextRoundReady, setNextRoundReady] = useState(false);

  // Track which "end_round phase" we're in:
  // "scores"   → show EndRoundOverlay (points earned / reveal button)
  // "revealed" → show NextRoundOverlay (after all answers revealed)
  const [endRoundPhase, setEndRoundPhase] = useState<"scores" | "revealed">("scores");

  const isSteal = state.screen === "steal";
  const isEndRound = state.screen === "end_round";
  const isRevealing = state.screen === "revealing";

  const { currentQuestion } = useGame();
  const totalAnswers = currentQuestion?.answers.length ?? 0;
  const allRevealed = state.revealed.length >= totalAnswers;

  // Reset gate flags when screen changes so they're fresh each round
  useEffect(() => {
    if (isSteal) {
      setStealReady(false);
    }
  }, [isSteal]);

  useEffect(() => {
    if (isEndRound) {
      setEndRoundReady(false);
      setEndRoundPhase("scores");
    }
  }, [isEndRound]);

  // Entering "revealing": if board already fully revealed (swept), skip straight
  // to the next-round gate. Otherwise wait for host to flip remaining tiles.
  useEffect(() => {
    if (isRevealing) {
      if (allRevealed) {
        // Swept board — go straight to next-round gate
        setNextRoundReady(false);
        setEndRoundPhase("revealed");
      } else {
        setEndRoundPhase("scores");
      }
    }
  }, [isRevealing, allRevealed]);

  const triggerBuzzer = () => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyX" && state.screen === "board") {
        triggerBuzzer();
        dispatch({ type: "ADD_STRIKE" });
      } else if (e.code === "KeyX" && state.screen === "steal" && stealReady) {
        triggerBuzzer();
        dispatch({ type: "STEAL_FAIL" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.screen, stealReady, dispatch]);

  const playingLabel =
    isSteal
      ? `STEALING: ${state.stealTeam === "teamA" ? "TEAM A" : "TEAM B"}`
      : isRevealing
      ? ""
      : `PLAYING: ${state.turn === "teamA" ? "TEAM A" : "TEAM B"}`;

  // ── What Enter-gate caption is currently needed? ──────────────────────────
  const showStealGate    = isSteal && !stealReady;
  const showEndRoundGate = isEndRound && !endRoundReady;
  const showRevealedGate = isRevealing && allRevealed && !nextRoundReady;
  const showAnyGate      = showStealGate || showEndRoundGate || showRevealedGate;

  const handleEnter = () => {
    if (showStealGate)    { setStealReady(true);    return; }
    if (showEndRoundGate) { setEndRoundReady(true);  return; }
    if (showRevealedGate) { setNextRoundReady(true); return; }
  };

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

      {/* Buzz toasts */}
      <div className="fixed inset-0 pointer-events-none z-[500000] flex items-center justify-center">
        <AnimatePresence>
          {toasts.map((toast) => <BuzzToast key={toast.id} />)}
        </AnimatePresence>
      </div>

      {/* Enter-to-continue gate — sits above everything except toasts */}
      {showAnyGate && <EnterToContinue onContinue={handleEnter} />}

      {/* Modals — only shown after their gate is cleared */}
      {isSteal && stealReady && <StealOverlay />}
      {isEndRound && endRoundReady && (
        <EndRoundOverlay onReveal={() => dispatch({ type: "START_REVEALING" })} />
      )}
      {isRevealing && allRevealed && nextRoundReady && (
        <NextRoundOverlay />
      )}
    </div>
  );
}