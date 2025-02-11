import React from "react";
import MultiplierBox from "./MultiplierBox";
import { GamePhase, Multiplier } from "../lib/types";

// const defaultMultipliers: Multiplier] = [
//   {
//     value: "1.13x",
//     factor: 1.13,
//     borderColor: "#1B62EB",
//     backgroundColor: "#1B62EB",
//     growColor: "#1B62EB",
//   },
//   {
//     value: "1.60x",
//     factor: 1.6,
//     borderColor: "#FB2468",
//     backgroundColor: "#FB2468",
//     growColor: "#FB2468",
//   },
//   { value: "2.0x", factor: 2.0, borderColor: "#FB2468", growColor: "#FB2468" },
//   { value: "3.0x", factor: 3.0, borderColor: "#1B265C", growColor: "#1B265C" },
//   { value: "4.0x", factor: 4.0, borderColor: "#1B265C", growColor: "#1B265C" },
//   { value: "5.0x", factor: 5.0, borderColor: "#1B265C", growColor: "#1B265C" },
// ];

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
  return (
    <div className="flex justify-center items-center max-w-[400px]">
      {multipliers.map((multiplier, index) => {
        // In active mode, every box up to the current active index is forced blue.
        // In bomb state all boxes are forced red.
        let boxColor = multiplier;
        if (["cashOut", "result:win"].includes(gamePhase) && multiplier.factor <= currentMultiplier) {
          boxColor = {
            ...multiplier,
            borderColor: "#1B62EB",
            backgroundColor: "#1B62EB",
            growColor: "#1B62EB",
          };

          if(index < multipliers.length - 1) {
            multipliers[index+1].borderColor = "#1B62EB"
          }
        }
        if (["bombed", "result:lose"].includes(gamePhase) && multiplier.factor <= currentMultiplier) {
          boxColor = {
            ...multiplier,
            borderColor: "#FB2468",
            backgroundColor: "#FB2468",
            growColor: "#FB2468",
          };

          
          if(index < multipliers.length - 1) {
            multipliers[index+1].borderColor = "#FB2468"
          }
        }
        return (
          <React.Fragment key={index}>
            <MultiplierBox
              value={boxColor.value}
              borderColor={boxColor.borderColor}
              backgroundColor={boxColor.backgroundColor}
            />
            {index < multipliers.length - 1 && (
              <div
                className="h-0.5 grow w-2"
                style={{ backgroundColor: boxColor.growColor }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
