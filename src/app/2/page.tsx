"use client";
import { useState } from "react";
import SurveyBoard from "@/components/SurveyBoard";
import Nameplate from "@/components/Namebox";
import Lives from "@/components/Lives";

type Answer = {
  value: string;
  points: number;
};

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


  const handleAddPoints = (points: number) => {
    setScore((prev) => prev + points);
  };
  return (
    <div className="fixed top-0 flex flex-col flex-1 gap-4 items-center justify-center font-barlow h-full w-full dotted">
     <div className="w-[85%] max-w-[960px] flex flew-row align-center items-center">
     <Lives count={lives} active={true}/>
      <div className="w-full h-fit pt-2 relative flex flex-row justify-around">
        <div className="font-space-mono font-[700] text-4xl text-white bg-black p-2 px-4">
          {score.toString().padStart(3, "0")}
        </div>
      </div>     
      <Lives count={lives} active={true}/>
      </div>
      <SurveyBoard answers={testAnswers} addPoints={handleAddPoints} />
      <div className="w-[85%] max-w-[1048px] h-fit pt-2 relative flex flex-row justify-between">
        <Nameplate name="WinnerWinnerChickenDinner" score={0} />
        <Nameplate name="WinnerWinnerChickenDinner" score={0} />
      </div>
    </div>
  );
}
