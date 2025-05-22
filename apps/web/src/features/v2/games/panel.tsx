"use client";

import React from "react";
import MultiplierBar from "@web/features/games/mines/ui/MultiplierBar";
import { MineGame } from "@web/features/games/mines";

import "./panel.styles.css"
import dynamic from "next/dynamic";

const DynamicGamePanel = dynamic(() => Promise.resolve(GamePanelInner), {
  ssr: false
});

export function Panel() {
  return <DynamicGamePanel />;
}

function GamePanelInner() {
  return (
    <div className="game-panel">
      <MultiplierBar />
      <MineGame />
    </div>
  );
}
