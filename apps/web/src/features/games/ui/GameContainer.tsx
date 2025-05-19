/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { BetPanel } from "../mines/ui/BetPanel";
import { GamePhase } from "../mines/lib/types";
import { Cell } from "../mines";
import { convertServerGrid } from "../mines/lib/helper";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import { useTRPC } from "@web/shared/trpc/client";
import { GamePanel } from "./GamePanel";
import { useMobuleWebhook } from "../hooks/useMobuleWebhook";

export interface GameContainerProps {
  mode?: "demo" | "real";
  session?: string | null;
  currency?: string | null;
  lang?: string | null;
  userBalance?: UseQueryResult<{ balance: number }, Error>;
  demoBalance?: number;
  updateDemoBalance?: (balance: number) => void;
}

// Dynamically import components that use TRPC to ensure they only load on client
const DynamicGameContainer = dynamic(
  () => Promise.resolve(GameContainerInner),
  {
    ssr: false,
  }
);

export function GameContainer({
  mode = "demo",
  session,
  currency = "USD",
  lang = "en",
  userBalance,
  demoBalance,
  updateDemoBalance,
}: GameContainerProps) {
  return (
    <DynamicGameContainer
      {...{
        mode,
        session,
        currency,
        lang,
        userBalance,
        demoBalance,
        updateDemoBalance,
      }}
    />
  );
}

function GameContainerInner({
  mode = "demo",
  session,
  currency,
  lang,
  userBalance,
  demoBalance,
  updateDemoBalance,
}: GameContainerProps) {
  const { depositWin, withdrawBet, checkSession } = useMobuleWebhook({
    session,
    currency,
  });
  const api = useTRPC();
  const { mutateAsync } = useMutation(api.game.takeOut.mutationOptions());
  // These states will persist even after a game is finished.
  const [betAmount, setBetAmount] = useState<number>(0);
  const [mines, setMines] = useState<number>(1);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(0);
  const [grid, setGrid] = useState<Cell[]>([]);

  const updateMultipliers = (mines: number) => {
    // We'll allow up to 6 multiplier boxes (or fewer if there are very many mines)
    const multiplierCount = 25 - mines;

    return Array.from({ length: multiplierCount }, (_, i) => {
      // Calculate probability of winning for this step
      // Total cells = 25
      // Remaining safe cells = 25 - mines - i (i is the number of gems already revealed)
      // Probability = (remaining safe cells) / (total cells - i)
      const remainingSafeCells = 25 - mines - i;
      const remainingCells = 25 - i;
      const probability = remainingSafeCells / remainingCells;

      // Multiplier is the inverse of probability
      const factor = 1 / probability;

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

  const [roundCounter, setRoundCounter] = useState(0);
  useEffect(() => {
    if (gamePhase === "initial") {
      setRoundCounter((prev) => prev + 1);
    }
  }, [gamePhase]);
  const round_id = `session:${session ?? mode}:${roundCounter}`;
  const trx_id = `session:${session ?? mode}:round_${roundCounter}:trx_`;

  const handleMinesSelect = (minesCount: number) => {
    setMines(minesCount);
  };
  // This callback is passed into BetPanel. It is called when the user clicks its Place Bet button.
  // (You cannot change BetPanel's code, so we use this as our "placeholder" to start the game.)
  const handlePlaceBet = async (bet: number) => {
    if (mode !== "demo") {
      await withdrawBet.mutateAsync({
        amount: bet * 100,
        trx_id: `${trx_id}_bet`,
        round_id,
      });
    } else {
      updateDemoBalance?.(demoBalance ? demoBalance - bet : 0);
    }

    if (userBalance && "refetch" in userBalance) {
      await userBalance.refetch();
    }

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
  const handleBombHit = async () => {
    if (mode !== "demo") {
      // const depositWinResult = await depositWin.mutateAsync({
      //   amount: 0,
      //   trx_id,
      //   round_id,
      // });
      // console.log("Lose Deposit win result:", depositWinResult);
    } else {
      // updateDemoBalance?.(demoBalance ? demoBalance - betAmount : 0);
    }

    if (userBalance && "refetch" in userBalance) {
      await userBalance.refetch();
    }

    setGamePhase("bombed");
    // Wait a moment before resetting so the user can see the bomb state.
    handleFinishGame("lose");
  };

  // This dynamic action button is separate from BetPanel.
  // In "running" phase it shows "Select the cell" (and does nothing on click).
  // In "cashOut" phase it acts as the cash-out trigger.
  const handleCashOut = async () => {
    if (gamePhase === "cashOut") {
      const earned = betAmount * currentMultiplier;
      console.log("Earned amount:", earned, "USD");
      // Reset the game state (but keep the bet/mines values for reusing).
      try {
        const result = await mutateAsync({
          sessionId: session ?? mode,
        });

        if (session) {
          const depositWinResult = await depositWin.mutateAsync({
            amount: earned * 100,
            trx_id: `${trx_id}_win`,
            round_id,
          });
          console.log("Take out result:", result, depositWinResult);
        }

        if (userBalance && "refetch" in userBalance) {
          await userBalance.refetch();
        }

        if (mode === "demo") {
          updateDemoBalance?.(
            demoBalance ? demoBalance + Math.round(earned * 100) / 100 : 0
          );
        }

        setGrid(convertServerGrid(result.grid));
        handleFinishGame("win");
      } catch (error) {
        console.error("Error taking out:", error);
      }
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

  if (!session && mode !== "demo") {
    return <div>No session</div>;
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
        sessionId={session ?? mode}
      />
      <BetPanel
        session={session ?? mode}
        gamePhase={gamePhase}
        initialBet={betAmount}
        mines={mines}
        currentMultiplier={currentMultiplier}
        onPlaceBet={handlePlaceBet}
        handleMinesSelect={handleMinesSelect}
        handleCashOut={handleCashOut}
        currency={currency}
        userBalance={
          mode === "demo" ? { data: { balance: demoBalance! } } : userBalance
        }
      />
    </div>
  );
}
