"use client";

import React from "react";
import MultiplierBar from "../mines/ui/MultiplierBar";
import { Cell, MineGame } from "../mines";
import { GamePhase, Multiplier } from "../mines/lib/types";

import "./GamePanel.styles.css"
import dynamic from "next/dynamic";

interface GamePanelProps {
  grid: Cell[];
  setGrid: React.Dispatch<React.SetStateAction<Cell[]>>;
  mines: number;
  gamePhase: GamePhase;
  setGamePhase: (gamePhase: GamePhase) => void;
  multipliers: Multiplier[];
  betAmount: number;
  currentMultiplier: number;
  onGemClick: () => void;
  onBombHit: () => void;
  mode?: 'demo' | 'real';
  sessionId: string;
  gameSessionId?: string;
}

const DynamicGamePanel = dynamic(() => Promise.resolve(GamePanelInner), {
  ssr: false
});

export function GamePanel(props: GamePanelProps) {
  return <DynamicGamePanel {...props} />;
}

function GamePanelInner({
  grid,
  setGrid,
  mines,
  multipliers,
  betAmount,
  currentMultiplier,
  gamePhase,
  setGamePhase,
  onGemClick,
  onBombHit,
  mode = 'demo',
  sessionId,
  gameSessionId,
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
        grid={grid}
        setGrid={setGrid}
        sessionId={sessionId}
        mines={mines}
        betAmount={betAmount}
        currentMultiplier={currentMultiplier}
        gamePhase={gamePhase}
        onGameStart={handleGameStart}
        onBombHit={handleBombHitInternal}
        onGemClick={onGemClick}
        mode={mode}
        gameSessionId={gameSessionId}
      />
    </div>
  );
}
