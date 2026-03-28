"use client";

import Image from "next/image";

type TextboxProps = {
  title: string;
  text: string;
};

export default function Textbox({ title, text }: TextboxProps) {
  return (
    <div className="w-[75%]  max-w-[750px] h-[75%] relative">
      <div className="w-[34%] capitalize text-3xl p-1 pb-2 text-center text-white bg-[#FF00B3] z-1000 absolute top-[18%] left-[33%] font-barlow-condensed font-[800]">
        {title.toUpperCase()}
      </div>

      <div className=" w-[67%] text-center z-1000 absolute top-[38%] left-[16.5%] text-4xl font-[700] font-space-mono">{text}</div>
        <Image
          src="/Textbox.png"
          alt="Blerd Feud"
          fill={true}
          style={{ objectFit: "contain", padding: "0px", zIndex: 0 }}
          quality={100}
          priority
        />
    </div>
  );
}
