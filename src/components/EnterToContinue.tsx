"use client";

import { useEffect } from "react";

type Props = {
  onContinue: () => void;
};

export default function EnterToContinue({ onContinue }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div        
    onClick={onContinue}
    className="fixed inset-0 w-full h-full z-[99999] pointer-events-auto flex items-end justify-center p-10 bg-transparent"
    >
      <span
        className="font-space-mono text-base text-black animate-pulse"
        style={{ pointerEvents: "auto", cursor: "pointer" }}
      >
        PRESS ENTER TO CONTINUE
      </span>
    </div>
  );
}