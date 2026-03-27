"use client";

import { useEffect } from "react";
import { useGame } from "@/context/GameContext";

type Props = {
  locked?: boolean; // face-off mode: show board but disable all interaction
};

export default function SurveyBoard({ locked = false }: Props) {
  const { state, currentQuestion, dispatch } = useGame();

  const canInteract = !locked && (state.screen === "board" || state.screen === "steal");

  // Keyboard 1–8 reveals that answer slot
  useEffect(() => {
    if (!canInteract) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (isNaN(num) || num < 1 || num > 8) return;
      const index = num - 1;
      if (!currentQuestion) return;
      const answer = currentQuestion.answers[index];
      if (!answer) return;
      if (state.revealed.includes(index)) return;

      if (state.screen === "steal") {
        dispatch({ type: "STEAL_SUCCESS", payload: { index, points: answer.points } });
      } else {
        dispatch({ type: "REVEAL_ANSWER", payload: { index, points: answer.points } });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canInteract, currentQuestion, state.revealed, state.screen, dispatch]);

  if (!currentQuestion) return null;

  const slots = Array.from({ length: 8 }, (_, i) =>
    i < currentQuestion.answers.length ? currentQuestion.answers[i] : null
  );

  return (
    <div className="w-[1048px] h-[600px] relative border-[10px] border-[#ff86d6] rounded-3xl bg-[#FF00B3] py-[25px] px-[35px] flex flex-col flex-wrap justify-evenly content-between transition-all duration-100">
      {slots.map((answer, i) => (
        <SurveyAnswer
          key={i}
          answer={answer}
          rank={i + 1}
          answerIndex={i}
          isRevealed={state.revealed.includes(i)}
          locked={locked}
        />
      ))}
    </div>
  );
}

type AnswerProps = {
  answer: { value: string; points: number } | null;
  rank: number;
  answerIndex: number;
  isRevealed: boolean;
  locked: boolean;
};

function SurveyAnswer({ answer, rank, answerIndex, isRevealed, locked }: AnswerProps) {
  const { state, dispatch } = useGame();

  const canClick =
    !locked &&
    !isRevealed &&
    answer !== null &&
    (state.screen === "board" || state.screen === "steal");

  const handleClick = () => {
    if (!canClick || !answer) return;
    if (state.screen === "steal") {
      dispatch({ type: "STEAL_SUCCESS", payload: { index: answerIndex, points: answer.points } });
    } else {
      dispatch({ type: "REVEAL_ANSWER", payload: { index: answerIndex, points: answer.points } });
    }
  };

  // Empty slot
  if (!answer) {
    return (
      <div className="w-[49%] h-[21.5%] border-[5px] border-[#ff86d6] bg-gradient-to-b from-[#fe86d6] to-[#ff00b3]" />
    );
  }

  // Revealed
  if (isRevealed) {
    return (
      <div className="flex flex-row w-[49%] h-[21.5%] border-[5px] border-[#ff86d6]">
        <div className="flex w-[75%] h-full bg-gradient-to-b from-[#fe86d680] to-[#fe86d6BF] items-center justify-center text-center font-barlow-condensed font-[400] text-white text-6xl">
          {answer.value}
        </div>
        <div className="flex w-[25%] h-full border-l-[5px] border-[#ff86d6] bg-[#fe86d680] items-center justify-center text-center font-barlow-condensed font-[600] text-white text-6xl">
          {answer.points}
        </div>
      </div>
    );
  }

  // Hidden
  return (
    <div
      onClick={handleClick}
      className={`w-[49%] h-[21.5%] border-[5px] border-[#ff86d6] bg-gradient-to-b from-[#fe86d7] to-[#ff00b3] leading-[100px] text-center font-barlow font-[800] text-white text-7xl transition-opacity ${
        canClick
          ? "hover:cursor-pointer hover:opacity-75"
          : "opacity-50 cursor-default"
      }`}
    >
      {rank}
    </div>
  );
}