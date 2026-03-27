"use client";
import { useEffect, useState } from "react";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import Lives from "@/components/Lives";
import BuzzToast from "@/components/BuzzToast";
import { AnimatePresence } from "motion/react";

type Answer = {
  value: string;
  points: number;
};

interface Toast {
  id: number;
  message: string;
}

export default function SurveyRound() {
  const testAnswers: Answer[] = [
    { value: "Answer1", points: 100 },
    { value: "Answer2", points: 90 },
    { value: "Answer3", points: 75 },
    { value: "Answer4", points: 50 },
    { value: "Answer5", points: 35 },
    { value: "Answer6", points: 10 },
  ];
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [buzzing, setBuzzing] = useState();

  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerBuzzer = (message: string) => {
    const id = Date.now();
    const newToast = { id, message };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  const handleAddPoints = (points: number) => {
    setScore((prev) => prev + points);
  };

  const [currentTeam, setCurrentTeam] = useState("Team A");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyX") {
        triggerBuzzer("POW!");
        setLives((prevLives) => prevLives - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
  if (lives === 0) {
    setCurrentTeam("Team B");
  } else if (lives === -1) {
    setCurrentTeam("Team A");
  }
}, [lives]);

  return (
    <div className="fixed top-0 flex flex-col flex-1 gap-4 items-center justify-center font-barlow h-full w-full dotted">
      <div className="w-[85%] max-w-[1048px] flex flew-row align-center items-center">
        <div className="w-[33%] h-fit pt-2 relative flex flex-row justify-around">
          <div className="w-full font-barlow-condensed justify-start font-[700] text-4xl text-black p-2 px-4">
            {`Playing Now: ${currentTeam}`.toUpperCase()}
          </div>
        </div>

        <div className="w-[33%] h-fit pt-2 relative flex flex-row justify-around">
          <div className="font-space-mono font-[700] text-4xl text-white bg-black p-2 px-4">
            {score.toString().padStart(3, "0")}
          </div>
        </div>
        <Lives count={lives} active={true} />
      </div>

      <SurveyBoard answers={testAnswers} addPoints={handleAddPoints} />

      <div className="w-[85%] max-w-[1048px] h-fit pt-2 relative flex flex-row justify-between">
        <Nameplate name="Team A" score={0} />
        <Nameplate name="Team B" score={0} />
      </div>

      <div className="w-full h-full fixed inset-0 pointer-events-none z-500000 flex items-center justify-center">
        <AnimatePresence>
          {toasts.map((toast) => (
            <BuzzToast key={toast.id} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
