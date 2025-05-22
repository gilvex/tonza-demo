/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { GameState, useGame } from "@web/features/games/hooks/useGame";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Panel } from "./panel";
import { BetPanel } from "@web/features/games/mines/ui/BetPanel";

export interface GameContainerProps {
  mode?: "demo" | "real";
  session?: string | null;
  demoBalance?: number;
  updateDemoBalance?: (balance: number) => void;
  lastUnfinishedGame?: any;
}

export const DynamicGameContainer = dynamic(
  () => Promise.resolve(GameContainerInner),
  {
    ssr: false,
    loading: () => <div className="flex flex-col items-center gap-3 pb-3 lg:flex-row w-full lg:max-w-full lg:items-end h-full">
      <Loader2 className="animate-spin" />
    </div>
  }
);

function GameContainerInner() {
  const { game, resetGame } = useGame();

  useEffect(() => {
    // Only set up the timer if we're in a terminal state
    if (game?.state === GameState.LOSE || game?.state === GameState.VICTORY) {
      const timer = setTimeout(() => {
        resetGame();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [game?.state, resetGame]); // Only depend on state changes

  return (
    <div className="flex flex-col items-center gap-3 pb-3 lg:flex-row w-full lg:max-w-full lg:items-end h-full">
      <Panel />
      <BetPanel />
    </div>
  );
}
