"use client";

import Textbox from "@/components/Textbox";
import { useGame } from "@/context/GameContext";
import Image from "next/image";

export default function RulesScreen() {
  const { dispatch } = useGame();

  return (
    <div className="fixed top-0 flex flex-col flex-1 items-center justify-center font-barlow h-full w-full dotted gap-0">
      <div className="w-[75%]  max-w-[1250px] h-[95%] max-h-[2500px] relative ">
        <div className="w-[34%] h-fit capitalize text-3xl p-1 pb-2 text-center text-white bg-[#FF00B3] z-1000 absolute top-[18%] left-[33%] font-barlow-condensed font-[800]">
          HOW TO PLAY
        </div>

        <Image
          src="/Rules.png"
          alt="Blerd Feud"
          fill={true}
          style={{ objectFit: "contain", padding: "0px", zIndex: 0 }}
          quality={100}
          priority
        />
      </div>{" "}
      <button
        onClick={() => dispatch({ type: "START_QUESTIONS" })}
        className=" fixed bottom-25 cursor-pointer hover:opacity-85 hover:scale-105 transition-all duration-200 font-space-mono font-[700] text-2xl bg-black text-white px-7"
      >
        LET'S PLAY →
      </button>
    </div>
  );
}
