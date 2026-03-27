import Image from "next/image";
import Textbox from "@/components/Textbox";

export default function Home() {
  return (
    <div className="fixed top-0 flex flex-col flex-1 items-center justify-center font-barlow h-full w-full dotted">
        <Textbox title="Question 1" text="Longer phrase probably use variable for this."/>
    </div>
  );
}
