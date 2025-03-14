import React, { useEffect, useRef } from "react";
import MultiplierBox from "./MultiplierBox";
import { GamePhase, Multiplier } from "../lib/types";

interface MultiplierBarProps {
  gamePhase: GamePhase;
  currentMultiplier: number;
  multipliers: Multiplier[];
}

export default function MultiplierBar({
  gamePhase,
  currentMultiplier,
  multipliers,
}: MultiplierBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const multiplierRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll into view when currentMultiplier changes
  useEffect(() => {
    const currentIndex = multipliers.findIndex(
      (multiplier) => multiplier.factor === currentMultiplier
    );

    const multiplierRef = !currentMultiplier
      ? multiplierRefs.current[0]
      : multiplierRefs.current[currentIndex];

    if (multiplierRef) {
      multiplierRef?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentMultiplier, multipliers]);

  return (
    <div className="w-full flex justify-center max-w-sm lg:max-w-xl">
      <div
        ref={containerRef}
        className="flex items-center overflow-hidden snap-x snap-mandatory"
      >
        {multipliers.map((multiplier, index) => {
          let boxColor = multiplier;

          if (
            ["cashOut", "result:win"].includes(gamePhase) &&
            multiplier.factor <= currentMultiplier
          ) {
            boxColor = {
              ...multiplier,
              borderColor: "#1B62EB",
              backgroundColor: "#1B62EB",
              growColor: "#1B62EB",
            };
            if (index < multipliers.length - 1)
              multipliers[index + 1].borderColor = "#1B62EB";
          }

          if (
            ["bombed", "result:lose"].includes(gamePhase) &&
            multiplier.factor <= currentMultiplier
          ) {
            boxColor = {
              ...multiplier,
              borderColor: "#FB2468",
              backgroundColor: "#FB2468",
              growColor: "#FB2468",
            };
            if (index < multipliers.length - 1)
              multipliers[index + 1].borderColor = "#FB2468";
          }

          return (
            <React.Fragment key={index}>
              <div
                ref={(el) => {
                  multiplierRefs.current[index] = el;
                }}
                className="snap-start w-20 flex-shrink-0"
              >
                <MultiplierBox
                  value={boxColor.value}
                  borderColor={boxColor.borderColor}
                  backgroundColor={boxColor.backgroundColor}
                />
              </div>
              {index < multipliers.length - 1 && (
                <div
                  className="h-0.5 min-w-2"
                  style={{ backgroundColor: boxColor.growColor }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
