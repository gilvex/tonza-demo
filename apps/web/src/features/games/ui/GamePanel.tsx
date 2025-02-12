"use client";

import React from "react";
import MultiplierBar from "../mines/ui/MultiplierBar";
import { MineGame } from "../mines";
import { GamePhase, Multiplier } from "../mines/lib/types";

import "./GamePanel.styles.css"

interface GamePanelProps {
  mines: number;
  gamePhase: GamePhase;
  setGamePhase: (gamePhase: GamePhase) => void;
  multipliers: Multiplier[];
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
    <div className="game-panel">
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
