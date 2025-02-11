"use client";

import React, { useEffect, useState } from "react";
import { BetPanel } from "../mines/ui/BetPanel";
import { GamePanel } from "./GamePanel";
import { GamePhase } from "../mines/lib/types";

export function GameContainer() {
  // These states will persist even after a game is finished.
  const [betAmount, setBetAmount] = useState<number>(10);
  const [mines, setMines] = useState<number>(1);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(0);

  const updateMultipliers = (mines: number) => {
    // We'll allow up to 6 multiplier boxes (or fewer if there are very many mines)
    const multiplierCount = Math.min(25 - mines, 6);

    // Define a risk factor that increases as the number of mines increases.
    // For example, if mines = 1 then riskFactor ≈ 25/24 ≈ 1.04;
    // if mines = 24 then riskFactor = 25/1 = 25.
    const riskFactor = 25 / (25 - mines);

    return Array.from({ length: multiplierCount }, (_, i) => {
      // Exponentially increase the multiplier based on its index.
      const factor = Math.pow(riskFactor, i + 1);
      return {
        value: `${factor.toFixed(2)}x`,
        factor,
        borderColor: "#1B265C",
        backgroundColor: "transparent",
        growColor: "#1B265C",
      };
    });
  };

  const [multipliers, setMultiplies] = useState(updateMultipliers(mines));
  const [gamePhase, setGamePhase] = useState<GamePhase>("initial");

  useEffect(() => {
    if (!gamePhase.includes("result")) {
      setMultiplies(updateMultipliers(mines));
    }
  }, [gamePhase, mines]);
  // Game phase controls which components (and button text) to show:
  // - "initial": show BetPanel (to enter bet/mines)
  // - "running": game is live and waiting for a cell selection
  // - "cashOut": a safe cell was hit; dynamic button now acts as cash-out trigger
  // - "bombed": a bomb was hit; game ends

  const handleMinesSelect = (minesCount: number) => {
    setMines(minesCount);
  };
  // This callback is passed into BetPanel. It is called when the user clicks its Place Bet button.
  // (You cannot change BetPanel’s code, so we use this as our “placeholder” to start the game.)
  const handlePlaceBet = (bet: number) => {
    setBetAmount(bet);
    setGamePhase("running");
  };

  const handleFinishGame = (state: "win" | "lose") => {
    setGamePhase(`result:${state}`);

    setTimeout(() => {
      setGamePhase("initial");
    }, 2000);
  };

  // Called by GamePanel when a safe cell (gem) is revealed.
  const handleGemClick = () => {
    if (gamePhase === "running") {
      setGamePhase("cashOut");
    }

    setCurrentMultiplier(() => {
      const newMultiplier =
        multipliers.filter(({ factor }) => factor > currentMultiplier)[0]
          ?.factor ?? multipliers[multipliers.length - 1].factor;

      if (newMultiplier >= multipliers[multipliers.length - 1].factor) {
        handleCashOut();
      }

      return newMultiplier;
    });
  };

  // Called by GamePanel when a bomb is hit.
  const handleBombHit = () => {
    setGamePhase("bombed");
    // Wait a moment before resetting so the user can see the bomb state.
    handleFinishGame("lose");
  };

  // This dynamic action button is separate from BetPanel.
  // In "running" phase it shows "Select the cell" (and does nothing on click).
  // In "cashOut" phase it acts as the cash-out trigger.
  const handleCashOut = () => {
    if (gamePhase === "cashOut") {
      const earned = betAmount * currentMultiplier;
      console.log("Earned amount:", earned, "TON");
      // Reset the game state (but keep the bet/mines values for reusing).
      handleFinishGame("win");
    }
  };

  useEffect(() => {
    if (gamePhase === "initial") {
      setMultiplies((multiplies) =>
        multiplies.map((multiplier) => ({
          ...multiplier,
          borderColor: "#1B265C",
          backgroundColor: "transparent",
          growColor: "#1B265C",
        }))
      );
      setCurrentMultiplier(0);
    }
  }, [gamePhase]);

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-end">
      <GamePanel
        betAmount={betAmount}
        mines={mines}
        multipliers={multipliers}
        gamePhase={gamePhase}
        setGamePhase={setGamePhase}
        currentMultiplier={currentMultiplier}
        onGemClick={handleGemClick}
        onBombHit={handleBombHit}
      />
      <BetPanel
        gamePhase={gamePhase}
        initialBet={betAmount}
        mines={mines}
        currentMultiplier={currentMultiplier}
        onPlaceBet={handlePlaceBet}
        handleMinesSelect={handleMinesSelect}
        handleCashOut={handleCashOut}
      />
    </div>
  );
}
