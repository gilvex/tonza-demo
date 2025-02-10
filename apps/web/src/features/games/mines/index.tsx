"use client";

import { cn } from "@web/lib/utils";
import Image from "next/image";
import { useState } from "react";

export function MineButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [isShowGem, setShowGem] = useState(false);
  const [isBomb, setBomb] = useState(false);
  // shadow inner
  return (
    <button
      disabled={isShowGem || isBomb}
      className={cn(
        `relative w-full h-5/6 rounded-lg bg-blue-600 transition-all duration-200`,
        isPressed
          ? "translate-y-1.5 shadow-[0px_0px_0px_0px_rgb(14,51,132)] bg-blue-700"
          : "translate-y-0 shadow-[0px_8px_0px_0px_rgb(14,51,132)]",
        isShowGem
          ? cn(
              "bg-[#183934] border-2 border-[#1ED80F]",
              "shadow-[0px_8px_0px_0px_rgba(30,216,15,0.68),inset_0_0_10px_5px_rgba(30,216,15,0.6)]"
            )
          : "",
        isBomb
          ? cn(
              "bg-[#01021E] border-2 border-[#FB2468]",
              "shadow-[0px_8px_0px_0px_rgba(251,36,104,0.44),inset_0_0_10px_5px_rgba(251,36,104,0.6)]"
            )
          : ""
      )}
      onMouseDown={() => {
        setIsPressed(true);

        setTimeout(() => {
          if (Math.random() > 0.5) {
            setBomb(true);
          } else {
            setShowGem(true);
          }
        }, 500);
      }}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {isShowGem && (
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          <Image
            src="/gem.png"
            alt="gem"
            width={64} // Set the size of the gem
            height={64}
          />
        </div>
      )}
      {isBomb && (
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          <Image
            src="/bomb.png"
            alt="bomb"
            width={64} // Set the size of the gem
            height={64}
          />
        </div>
      )}
      {!isShowGem && !isBomb && (
        <div className="flex justify-center items-center">
          <div className="bg-blue-400 rounded-full blur-lg size-10" />
        </div>
      )}
    </button>
  );
}
