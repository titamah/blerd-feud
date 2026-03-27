"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Team } from "@/context/GameContext";

type Props = {
  team: Team;
};

export default function TeamBuzzToast({ team }: Props) {
  const src = team === "teamA" ? "/buzz-a.png" : "/buzz-b.png";
  const alt = team === "teamA" ? "Team A Buzz" : "Team B Buzz";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -20 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: [0, -5, 5, -5, 0],
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
      }}
      className="fixed inset-0 z-[50000] flex items-center justify-center pointer-events-none"
    >
      <div className="relative w-[45%] h-[45%]">
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "contain" }}
          quality={100}
          priority
        />
      </div>
    </motion.div>
  );
}