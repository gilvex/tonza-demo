"use client";

import React from "react";
import MultiplierBar from "../mines/ui/MultiplierBar";
import { MineGame } from "../mines";
import { cn } from "@web/lib/utils";
import { GamePhase, Multiplier } from "../mines/lib/types";

interface GamePanelProps {
  mines: number;
  gamePhase: GamePhase,
  setGamePhase: (gamePhase: GamePhase) => void;
  multipliers: Multiplier[]
  betAmount: number;
  currentMultiplier: number;
  onGemClick: () => void;
  onBombHit: () => void;
}

export function GamePanel({
  mines,
  multipliers,
  betAmount,
  currentMultiplier,
  gamePhase,
  setGamePhase,
  onGemClick,
  onBombHit,
}: GamePanelProps) {
  const handleGameStart = () => {
    setGamePhase("running");
  };

  const handleBombHitInternal = () => {
    setGamePhase("bombed");
    onBombHit();
  };

  return (
    <div
      className={cn(
        "from-[#09122F] from-70% to-[#1b60eba2] bg-gradient-to-b w-full rounded-2xl p-4 flex flex-col gap-3",
        "transition-all text-[2.5vw] sm:text-base items-center h-full"
      )}
    >
      <MultiplierBar
        multipliers={multipliers}
        gamePhase={gamePhase}
        currentMultiplier={currentMultiplier}
      />
      <MineGame
        mines={mines}
        betAmount={betAmount}
        currentMultiplier={currentMultiplier}
        gamePhase={gamePhase}
        onGameStart={handleGameStart}
        onBombHit={handleBombHitInternal}
        onGemClick={onGemClick}
      />
    </div>
  );
}
