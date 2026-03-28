"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { useGame, Team } from "@/context/GameContext";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import Lives from "@/components/Lives";
import BuzzToast from "@/components/BuzzToast";
import TeamBuzzToast from "@/components/TeamBuzzToast";

interface BuzzToastEntry {
  id: number;
  team: Team | null; // null = wrong-answer X buzz
}

export default function FaceOffScreen() {
  const { state, dispatch } = useGame();
  const { faceOff } = state;
  const [toasts, setToasts] = useState<BuzzToastEntry[]>([]);

  const triggerToast = (team: Team | null) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, team }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // A = Team A buzzes
      if (e.code === "KeyA") {
        triggerToast("teamA");
        dispatch({ type: "FACE_OFF_BUZZ", payload: "teamA" });
      }
      // B = Team B buzzes
      if (e.code === "KeyB") {
        triggerToast("teamB");
        dispatch({ type: "FACE_OFF_BUZZ", payload: "teamB" });
      }
      // X = wrong answer buzz (no lives lost)
      if (e.code === "KeyX" && faceOff.activeBuzzer !== null) {
        triggerToast(null);
        dispatch({ type: "FACE_OFF_ANSWER_WRONG" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, faceOff.activeBuzzer]);

  // Derive UI state
  const { activeBuzzer, answers } = faceOff;
  const teamsAnswered = answers?.map((a) => a.team);
  const bothAnswered = answers?.length === 2;
  const topAnswer = false;
  const waitingForBuzz = (!activeBuzzer && !bothAnswered) || topAnswer;
  const activeTeamLabel = activeBuzzer === "teamA" ? "TEAM A" : activeBuzzer === "teamB" ? "TEAM B" : null;

  // Which team hasn't answered yet (for "now it's your turn" prompt)
  const remainingTeam = answers?.length === 1
    ? (answers[0].team === "teamA" ? "teamB" : "teamA")
    : null;

  return (
    <div className="fixed top-0 flex flex-col flex-1 gap-4 items-center justify-center font-barlow h-full w-full dotted">

      {/* Header */}
      <div className="w-[85%] max-w-[1048px] h-[56px] flex flex-row items-center justify-between">
        {/* Placeholder lives (greyed out — not active yet) */}
         {waitingForBuzz && answers?.length === 0 && (
          <p className="font-barlow-condensed font-[700] text-3xl text-black animate-pulse w-full text-center">
            WAITING FOR BUZZ IN...
          </p>
        )}
        {(waitingForBuzz && answers?.length === 1 && remainingTeam) && answers[0].answerIndex != 0  && (
          <p className="font-barlow-condensed font-[700] text-3xl text-black animate-pulse w-full text-center">
            {`${remainingTeam === "teamA" ? "TEAM A" : "TEAM B"}'S CHANCE TO STEAL!`}
          </p>
        )}
        {activeBuzzer && (
            <p className="font-barlow-condensed font-[700] text-3xl text-black justify-right animate-pulse w-full text-center">
              {`${activeTeamLabel} IS ANSWERING...`}
            </p>
        )}
      </div>

    

      {/* Board — always interactive during face-off */}
      <SurveyBoard mode="face_off" />

      {/* Round points (face-off answers accumulate) */}
      {/* <div className="w-[85%] max-w-[1048px] flex flex-row items-center justify-center">
        <div className="font-space-mono font-[700] text-4xl text-white bg-black p-2 px-4">
          {state.roundPoints.toString().padStart(3, "0")}
        </div>
      </div> */}

      {/* Nameplates */}
      <div className="w-[85%] max-w-[1048px] flex flex-row justify-between">
        <Nameplate name="Team A" score={state.scores.teamA} />
        <Nameplate name="Team B" score={state.scores.teamB} />
      </div>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map((toast) =>
          toast.team ? (
            <TeamBuzzToast key={toast.id} team={toast.team} />
          ) : (
            <BuzzToast key={toast.id} />
          )
        )}
      </AnimatePresence>
    </div>
  );
}