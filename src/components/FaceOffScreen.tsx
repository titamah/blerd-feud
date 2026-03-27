"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useGame, Team } from "@/context/GameContext";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import TeamBuzzToast from "@/components/TeamBuzzToast";

interface BuzzToast {
  id: number;
  team: Team;
}

export default function FaceOffScreen() {
  const { state, dispatch } = useGame();
  const { faceOff } = state;
  const [toasts, setToasts] = useState<BuzzToast[]>([]);

  const triggerTeamBuzz = (team: Team) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, team }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyA") {
        triggerTeamBuzz("teamA");
        dispatch({ type: "FACE_OFF_BUZZ", payload: "teamA" });
      }
      if (e.code === "KeyB") {
        triggerTeamBuzz("teamB");
        dispatch({ type: "FACE_OFF_BUZZ", payload: "teamB" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // Determine current state of face-off to show right controls
  const firstBuzzed = faceOff.buzzedTeam;
  const firstWasWrong = faceOff.firstAnswerCorrect === false;
  const secondBuzzed = faceOff.secondBuzzedTeam;
  const bothWrong = firstWasWrong && secondBuzzed !== null;

  // Label for who is currently answering
  const answeringTeam = firstWasWrong && secondBuzzed
    ? secondBuzzed
    : firstBuzzed;

  return (
    <div className="fixed top-0 flex flex-col flex-1 gap-4 items-center justify-center font-barlow h-full w-full dotted">

      {/* Header */}
      <div className="w-[85%] max-w-[1048px] flex flex-row items-center">
        <div className="w-full font-barlow-condensed font-[700] text-4xl text-black p-2 px-4 text-center">
          FACE-OFF — PRESS <span className="bg-black text-white px-2">A</span> OR <span className="bg-black text-white px-2">B</span> TO BUZZ IN
        </div>
      </div>

      {/* Board (locked / display only) */}
      <SurveyBoard locked />

      {/* Controls */}
      <div className="w-[85%] max-w-[1048px] flex flex-col items-center gap-4">

        {/* No one has buzzed yet */}
        {!firstBuzzed && (
          <p className="font-space-mono text-xl text-black opacity-60">
            Waiting for a team to buzz in...
          </p>
        )}

        {/* First team buzzed, waiting for host to judge */}
        {firstBuzzed && !firstWasWrong && faceOff.firstAnswerCorrect === null && (
          <div className="flex flex-col items-center gap-3">
            <p className="font-barlow-condensed font-[700] text-3xl text-black">
              {`${firstBuzzed === "teamA" ? "TEAM A" : "TEAM B"} BUZZED IN`}
            </p>
            <p className="font-space-mono text-lg text-black opacity-70">
              Read the answer. Is it on the board?
            </p>
            <div className="flex flex-row gap-4">
              <button
                onClick={() => dispatch({ type: "FACE_OFF_CORRECT" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-black text-white px-6 py-2"
              >
                ✅ ON THE BOARD
              </button>
              <button
                onClick={() => dispatch({ type: "FACE_OFF_WRONG" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-[#FF00B3] text-white px-6 py-2"
              >
                ❌ NOT ON THE BOARD
              </button>
            </div>
          </div>
        )}

        {/* First was wrong, waiting for second buzz */}
        {firstWasWrong && !secondBuzzed && (
          <div className="flex flex-col items-center gap-2">
            <p className="font-barlow-condensed font-[700] text-3xl text-black animate-pulse">
              {`${firstBuzzed === "teamA" ? "TEAM B" : "TEAM A"} — BUZZ IN!`}
            </p>
            <p className="font-space-mono text-lg text-black opacity-70">
              Press <strong>{firstBuzzed === "teamA" ? "B" : "A"}</strong> when they answer.
            </p>
          </div>
        )}

        {/* Second team buzzed, waiting for host to judge */}
        {firstWasWrong && secondBuzzed && !bothWrong && (
          <div className="flex flex-col items-center gap-3">
            <p className="font-barlow-condensed font-[700] text-3xl text-black">
              {`${secondBuzzed === "teamA" ? "TEAM A" : "TEAM B"} BUZZED IN`}
            </p>
            <p className="font-space-mono text-lg text-black opacity-70">
              Read the answer. Is it on the board?
            </p>
            <div className="flex flex-row gap-4">
              <button
                onClick={() => dispatch({ type: "FACE_OFF_CORRECT" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-black text-white px-6 py-2"
              >
                ✅ ON THE BOARD
              </button>
              <button
                onClick={() => dispatch({ type: "FACE_OFF_WRONG" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-[#FF00B3] text-white px-6 py-2"
              >
                ❌ NOT ON THE BOARD
              </button>
            </div>
          </div>
        )}

        {/* Both wrong — host assigns manually */}
        {bothWrong && (
          <div className="flex flex-col items-center gap-3">
            <p className="font-barlow-condensed font-[700] text-3xl text-black">
              BOTH WRONG — HOST ASSIGNS
            </p>
            <div className="flex flex-row gap-4">
              <button
                onClick={() => dispatch({ type: "FACE_OFF_ASSIGN", payload: "teamA" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-black text-white px-6 py-2"
              >
                TEAM A PLAYS
              </button>
              <button
                onClick={() => dispatch({ type: "FACE_OFF_ASSIGN", payload: "teamB" })}
                className="cursor-pointer hover:opacity-85 transition-all font-space-mono font-[700] text-xl bg-black text-white px-6 py-2"
              >
                TEAM B PLAYS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nameplates */}
      <div className="w-[85%] max-w-[1048px] flex flex-row justify-between">
        <Nameplate name="Team A" score={state.scores.teamA} />
        <Nameplate name="Team B" score={state.scores.teamB} />
      </div>

      {/* Team buzz toasts */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <TeamBuzzToast key={toast.id} team={toast.team} />
        ))}
      </AnimatePresence>
    </div>
  );
}