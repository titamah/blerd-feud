"use client"
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="fixed top-0 flex flex-col flex-1 items-center justify-evenly font-barlow h-full w-full dotted">    
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -5 }}
      animate={{ 
        scale: [1, 1.25, 1], 
        opacity: 1, 
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
      }}
      className="w-[95%] h-[65%] relative z-50 flex flex-col justify-center items-center"
    ><AnimatePresence>
        <Image
          src="/Title.png"
          alt="Blerd Feud"
          fill={true}
          style={{objectFit: "contain", padding: "100px"}}
          quality={100}
          priority
        />
        </AnimatePresence>
        </motion.div>
        <div  onClick={()=>{}} className="cursor-pointer hover:opacity-85 hover:scale-115 transition-all duration-200 w-fit h-fit font-space-mono font-[700] text-3xl text-center mb-20 bg-black text-white px-4 py-2">
         {"Start Game ->".toUpperCase()}
        </div>
    </div>
  );
}
