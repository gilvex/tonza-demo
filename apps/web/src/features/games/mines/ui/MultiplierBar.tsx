  import React, { useEffect, useRef } from "react";
  import MultiplierBox from "./MultiplierBox";
  import { useGame } from "../../hooks/useGame";

  export default function MultiplierBar() {
    const { game, currentMultiplier, multipliers } = useGame();
    const containerRef = useRef<HTMLDivElement>(null);
    const multiplierRefs = useRef<(HTMLDivElement | null)[]>([]);


    const gameState = game?.state ?? "AWAITING_FIRST_INPUT";
    // Scroll into view when currentMultiplier changes
    useEffect(() => {
      const multiplierRef = !currentMultiplier
        ? multiplierRefs.current[0]
        : multiplierRefs.current[currentMultiplier];

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
              ["CASH_OUT_AVAILABLE", "VICTORY"].includes(gameState) &&
              multiplier.factor <= multipliers[currentMultiplier]?.factor
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
              ["LOSE", "FINISHED"].includes(gameState) &&
              multiplier.factor <= multipliers[currentMultiplier]?.factor
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
