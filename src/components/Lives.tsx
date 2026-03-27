"use client"
import Image from "next/image";

type Props ={
  count: number;
  active: boolean;
}

export default function Lives({count, active}:Props) {
  if (active) return (
    <div className="w-[33%] justify-end items-end h-fit relative z-2000 top-[5%] flex flew-row">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className={`w-fit ${i < count ? "opacity-100": "opacity-50"}`}>
            <Image
              src= {i < count ? "/bolt.svg" : "/bolt-bw.svg"}
              alt="Bolts"
              width={55}
              height={55}
              style={{ objectFit: "contain", padding: "0px", zIndex: 20000 }}
              quality={100}
              priority
            />
            </div>
          );
        })}
    </div>
  );
}
