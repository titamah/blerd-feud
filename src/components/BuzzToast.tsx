"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function BuzzToast() {
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
        rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
      }}
      className="w-full h-full fixed bottom-10 right-10 z-50 flex flex-col justify-center items-center"
    >
        <div className="w-[50%] h-[50%] fixed z-2000">
              <Image
                  src="/buzz.png"
                  alt="Nameplate"
                  fill={true}
                  style={{ objectFit: "contain", padding: "0px", zIndex: 20000 }}
                  quality={100}
                  priority
                  />
             </div>
    </motion.div>)}