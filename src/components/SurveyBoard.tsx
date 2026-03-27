"use client";

import { useState } from "react";

type Answer = {
  value: string;
  points: number;
};

type Props = {
  answers: Answer[];
  addPoints: (points:number) => void;
};

export default function SurveyBoard({ answers, addPoints }: Props) {
  return (
    <div className="w-[1048px] h-[600px] relative border-[10px] border-[#ff86d6] rounded-3xl bg-[#FF00B3] py-[25px] px-[35px] flex flex-col flex-wrap justify-evenly content-between transition-all duration-100 ">
      {Array.from({ length: 8 }).map((_, i) => {
        const answer = i < answers.length ? answers[i] : null;
        return <SurveyAnswer key={i} answer={answer} rank={i + 1} addPoints={addPoints} />;
      })}
    </div>
  );
}

type AnswerProps = {
  answer: Answer | null;
  rank: number;
  addPoints: (points:number) => void;
}

export function SurveyAnswer({
  answer,
  rank,
  addPoints
}: AnswerProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    if (answer) {
      answer.points *= -1;
      addPoints(answer?.points * -1);
    }
  };

  if (!answer) {
    return (
      <div className="w-[49%] h-[21.5%] border-[5px] border-[#ff86d6] bg-gradient-to-b from-[#fe86d6] to-[#ff00b3]"></div>
    );
  } else if (showAnswer) {
    return (
      <div 
        onClick={toggleAnswer} className="flex flew-row w-[49%] h-[21.5%] border-[5px] border-[#ff86d6] ">
        <div className="flex w-[75%] h-full bg-gradient-to-b from-[#fe86d680] to-[#fe86d6BF] items-center justify-center text-center font-barlow-condensed font-[400] text-white text-6xl">
          {answer?.value}
        </div>
        <div className=" flex w-[25%] h-full border-l-[5px] border-[#ff86d6] bg-[#fe86d680] items-center justify-center text-center font-barlow-condensed font-[600] text-white text-6xl">
          {Math.abs(answer?.points)}
        </div>
      </div>
    );
  } else {
    return (
      <div
        onClick={toggleAnswer}
        className="w-[49%] h-[21.5%] border-[5px] border-[#ff86d6] bg-gradient-to-b from-[#fe86d7] to-[#ff00b3] leading-[100px] text-center font-barlow font-[800] text-white text-7xl hover:cursor-pointer hover:opacity-75"
      >
        {rank}
      </div>
    );
  }
}
