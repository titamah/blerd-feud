"use client";

import Textbox from "@/components/Textbox";
import { useGame } from "@/context/GameContext";

export default function QuestionScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  if (!currentQuestion) return null;
  const questionNumber = state.questionIndex + 1;
  const totalQuestions = state.questions.length;

  return (
    <div className="fixed top-0 flex flex-col flex-1 items-center justify-center font-barlow h-full w-full dotted gap-8">
      {/* <div className="font-barlow-condensed font-[700] text-2xl text-black opacity-60">
        {`QUESTION ${questionNumber} OF ${totalQuestions}`}
      </div> */}
      <Textbox title={`Question ${questionNumber}`} text={currentQuestion.text} />
      <button
        onClick={() => dispatch({ type: "SHOW_BOARD" })}
        className="cursor-pointer hover:opacity-85 hover:scale-105 transition-all duration-200 font-space-mono font-[700] text-2xl bg-black text-white px-6 py-3"
      >
        SHOW BOARD →
      </button>
    </div>
  );
}