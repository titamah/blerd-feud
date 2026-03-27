import Image from "next/image";

type NameplateProps = {
  name: string;
  score: number;
};

export default function Nameplate({ name, score }: NameplateProps) {
  return (
    <div className="w-[350px] h-fit relative">
      
      <div className="flex flew-row gap-8 w-full h-full pt-4 p-5">
        <div className=" z-100 flex w-[70%] h-full items-center justify-center text-center font-space-mono font-[600] text-white text-3xl">
          {name.toUpperCase().substring(0,10)}
        </div>
        <div className="z-100 flex w-[20%] h-full items-center justify-center text-center font-space-mono font-[600] text-white text-3xl">
          {score.toString().padStart(3, '0')}
        </div>
      </div>
        <Image
          src="/nameplate.png"
          alt="Nameplate"
          fill={true}
          // width={50}
          style={{ objectFit: "contain", padding: "0px", zIndex: 0 }}
          quality={100}
          priority
        />
    </div>
  );
}
