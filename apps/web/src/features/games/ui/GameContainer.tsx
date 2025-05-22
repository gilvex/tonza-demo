/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BetPanel } from "../mines/ui/BetPanel";
import { GamePhase } from "../mines/lib/types";
import { Cell } from "../mines";
import { convertServerGrid } from "../mines/lib/helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@web/shared/trpc/client";
import { GamePanel } from "./GamePanel";
import { useMobuleWebhook } from "../hooks/useMobuleWebhook";
import { GameProvider } from "../context/GameContext";

export interface GameContainerProps {
  mode?: "demo" | "real";
  session?: string | null;
  demoBalance?: number;
  updateDemoBalance?: (balance: number) => void;
  lastUnfinishedGame?: any;
}

const DynamicGameContainer = dynamic(
  () => Promise.resolve(GameContainerInner),
  {
    ssr: false,
  }
);

export function GameContainer(props: GameContainerProps) {
  return (
    <GameProvider>
      <DynamicGameContainer {...props} />
    </GameProvider>
  );
}

function GameContainerInner({
  mode = "demo",
  session,
  demoBalance,
  updateDemoBalance,
  lastUnfinishedGame,
}: GameContainerProps) {
  const { checkSession, checkBalance } = useMobuleWebhook({ session, currency: "USD" });
  const api = useTRPC();
  const userId = checkSession.data?.id_player;
  // console.log("userId", userId);
  // State for game
  const [gameId, setGameId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [mines, setMines] = useState<number>(lastUnfinishedGame.data?.mines || 1);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>("initial");
  const [multipliers, setMultipliers] = useState(() =>
    updateMultipliers(mines)
  );


  const allowToBet = useMutation(api.game.allowToBet.mutationOptions());
  // const revealCell = useMutation(api.game.revealCell.mutationOptions());
  const cashOut = useMutation(api.game.cashOut.mutationOptions());

  // When last game loads, set state
  useEffect(() => {
    const lastGame = lastUnfinishedGame.data;
    if (lastGame && lastGame.grid) {
      // console.log("lastGame", lastGame, convertServerGrid(lastGame.grid));
      setGameId(lastGame.id);
      setGrid(convertServerGrid(lastGame.grid));
      setGamePhase(
        lastGame.state === "AWAITING_FIRST_INPUT"
          ? "running"
          : lastGame.state === "CASH_OUT_AVAILABLE"
            ? "cashOut"
            : lastGame.state === "VICTORY"
              ? "result:win"
              : lastGame.state === "LOSE"
                ? "result:lose"
                : "initial"
      );
      setMines(lastGame.mines);
    }
  }, [lastUnfinishedGame.data]);

  // Update multipliers when mines or phase changes
  useEffect(() => {
    if (!gamePhase.includes("result")) {
      setMultipliers(updateMultipliers(mines));
    }
  }, [gamePhase, mines]);

  // Place bet (start new game)
  const handlePlaceBet = async (bet: number) => {
    if (!userId) return;
    setBetAmount(bet);
    const result = await allowToBet.mutateAsync({
      userId,
      rows: 5,
      cols: 5,
      mines,
    });
    setGameId(result.id);
    setGrid(convertServerGrid(result.grid));
    setGamePhase("running");
    // lastGameQuery.refetch();
  };

  // Reveal a cell
  const handleRevealCell = async (index: number) => {
    if (!gameId || !userId) return;
    const row = Math.floor(index / 5);
    const col = index % 5;
    
    // Count revealed gems in current grid
    const revealedGems = grid.filter(cell => cell.isGem && cell.isRevealed).length;
    const totalPossibleGems = 25 - mines;
    
    if (revealedGems === totalPossibleGems) {
      setGamePhase("result:win");
    } else {
      setGamePhase("cashOut");
    }
    // if (!gameId || !userId) return;
    // const row = Math.floor(index / 5);
    // const col = index % 5;
    // console.log("revealing cell", row, col);
    // const result = await revealCell.mutateAsync({ gameId, row, col });
    // setGrid(convertServerGrid(result.grid));
    // if (result.state === "VICTORY") {
    //   setGamePhase("result:win");
    // } else if (result.state === "LOSE") {
    //   setGamePhase("result:lose");
    // } else if (result.state === "CASH_OUT_AVAILABLE") {
    //   setGamePhase("cashOut");
    // }
    // lastGameQuery.refetch();
  };

  // Cash out
  const handleCashOut = async () => {
    if (!gameId || !userId) return;
    const result = await cashOut.mutateAsync({ gameId });
    setGrid(convertServerGrid(result.grid));
    setGamePhase("result:win");
    // lastGameQuery.refetch();
  };

  // Mines select
  const handleMinesSelect = (minesCount: number) => {
    setMines(minesCount);
  };

  // Multiplier logic
  function updateMultipliers(mines: number) {
    const multiplierCount = 25 - mines;
    return Array.from({ length: multiplierCount }, (_, i) => {
      const remainingSafeCells = 25 - mines - i;
      const remainingCells = 25 - i;
      const probability = remainingSafeCells / remainingCells;
      const factor = 1 / probability;
      return {
        value: `${factor.toFixed(2)}x`,
        factor,
        borderColor: "#1B265C",
        backgroundColor: "transparent",
        growColor: "#1B265C",
      };
    });
  }

  // Game finish
  const handleFinishGame = (state: "win" | "lose") => {
    setGamePhase(`result:${state}`);
    setTimeout(() => {
      setGamePhase("initial");
    }, 2000);
  };

  // Gem click
  const handleGemClick = (index: number) => {
    if (gamePhase === "running") {
      handleRevealCell(index);
    }
  };

  // Bomb hit
  const handleBombHit = () => {
    setGamePhase("result:lose");
    handleFinishGame("lose");
  };

  // UI rendering
  if (!userId && mode !== "demo") {
    return <div>No user</div>;
  }

  return (
    <div className="flex flex-col items-center gap-3 pb-3 lg:flex-row w-full lg:max-w-full lg:items-end h-full">
      <GamePanel
        grid={grid}
        setGrid={setGrid}
        betAmount={betAmount}
        mines={mines}
        multipliers={multipliers}
        gamePhase={gamePhase}
        setGamePhase={setGamePhase}
        currentMultiplier={currentMultiplier}
        onGemClick={handleGemClick}
        onBombHit={handleBombHit}
        mode={mode}
        sessionId={gameId ?? ""}
        gameSessionId={gameId ?? ""}
      />
      <BetPanel
        mode={mode}
        session={session}
        gameId={gameId ?? ""}
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
