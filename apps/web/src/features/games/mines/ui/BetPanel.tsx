"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@web/components/ui/button";
import { Input } from "@web/components/ui/input";
import { Slider } from "@web/components/ui/slider";
import { cn } from "@web/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GamePhase } from "../lib/types";
import { UseQueryResult } from "@tanstack/react-query";
// import { useMobuleWebhook } from "../../hooks/useMobuleWebhook";

export interface BetPanelProps {
  gamePhase: GamePhase;
  currentMultiplier: number;
  mines: number;
  initialBet?: number;
  onPlaceBet: (bet: number) => void;
  handleMinesSelect: (mines: number) => void;
  handleCashOut: () => void;
  currency?: string | null;
  userBalance?:
    | UseQueryResult<{ balance: number }, Error>
    | { data: { balance: number } };
  session?: string | null;
}

export function BetPanel({
  gamePhase,
  currentMultiplier,
  mines,
  initialBet = 0,
  onPlaceBet,
  handleMinesSelect,
  handleCashOut,
  currency = "USD",
  userBalance: userBalanceQuery,
  session,
  // session
}: BetPanelProps) {
  const [betAmount, setBetAmount] = useState<number>(initialBet);
  const displayCurrency = currency?.toLowerCase() || "usd";

  const userBalanceValue = userBalanceQuery?.data?.balance || 0;
  const userBalance =  userBalanceValue * (session === "demo" ? 100 : 1); // Assuming userBalance is in cents

  const handleHalf = () =>
    setBetAmount((prev) => Math.round(Math.max(0, prev / 2)));
  const handleDouble = () =>
    setBetAmount((prev) => Math.round(Math.min(userBalance / 100, prev * 2)));
  const handleIncrement = () =>
    setBetAmount((prev) => Math.round(Math.min(userBalance / 100, prev + 1)));
  const handleDecrement = () =>
    setBetAmount((prev) => Math.round(Math.max(0, prev - 1)));

  const handleSliderChange = (value: number[]) => {
    // Assuming the slider returns an array of numbers
    handleMinesSelect(value[0]);
  };

  const handlePlaceBet = async () => {
    onPlaceBet(betAmount);
  };

  const betButtons = (
    <>
      <Button
        className="hover:bg-[#12182d]"
        onClick={handleHalf}
        disabled={gamePhase !== "initial"}
      >
        1/2
      </Button>
      <Button
        className="hover:bg-[#12182d]"
        onClick={handleDouble}
        disabled={gamePhase !== "initial"}
      >
        2x
      </Button>
      <div className="flex flex-col rounded-md justify-center items-center">
        <button
          onClick={handleIncrement}
          className={cn(
            "hover:bg-[#12182d] w-full rounded-t-md h-full *:stroke-[4] hover:cursor-pointer"
          )}
          disabled={gamePhase !== "initial"}
        >
          <ChevronUp className="w-full h-3" />
        </button>
        <button
          onClick={handleDecrement}
          className="hover:bg-[#12182d] w-full rounded-b-md h-full *:stroke-[4] hover:cursor-pointer"
          disabled={gamePhase !== "initial"}
        >
          <ChevronDown className="w-full h-3" />
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-[#09122F] py-3 px-5 rounded-2xl w-full h-full sm:max-h-[35%] lg:max-h-full flex flex-col gap-2 lg:max-w-full">
      {/* Bet Amount Section */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <p className="text-[#9EA8DD]">Bet Amount:</p>
          <div className="flex items-center gap-1">
            <p className="text-[#9EA8DD]">Balance: {userBalance / 100}</p>
            <Image
              src={`/${displayCurrency}.png`}
              alt={displayCurrency}
              className="size-6"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="border border-[#1A2340] bg-[#01021E] rounded-xl font-bold flex items-center p-2.5 h-10 lg:h-16 gap-2.5">
          <Image
            src={`/${displayCurrency}.png`}
            alt={displayCurrency}
            className="size-6"
            width={24}
            height={24}
          />
          <span className="h-6 border border-[#2C376D]" />
          <Input
            disabled={gamePhase !== "initial"}
            className={cn(
              "border-none h-6 focus-visible:ring-0 px-0 lg:text-lg"
            )}
            type="number"
            value={betAmount}
            onChange={(e) =>
              setBetAmount(
                Math.round(Math.min(userBalance / 100, Number(e.target.value)))
              )
            }
            onBlur={() => setBetAmount(Math.round(Math.max(0, betAmount)))}
          />
          <div
            className={cn(
              "py-2.5 flex gap-1 *:select-none lg:hidden",
              "*:bg-[#1A2340] *:text-white *:h-7 *:w-9 *:font-bold *:text-xs"
            )}
          >
            {betButtons}
          </div>
        </div>

        <div
          className={cn(
            "lg:flex hidden gap-3",
            "*:bg-[#1A2340] *:w-full *:text-white *:h-10 *:font-bold *:text-base"
          )}
        >
          {betButtons}
        </div>
      </div>

      {/* Mines Slider Section */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#9EA8DD]">Mines (1-24)</p>
        <div className="bg-[#01021E] flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1A2340] h-10 lg:h-16">
          <p className="font-bold">{mines}</p>
          <Slider
            disabled={gamePhase !== "initial"}
            defaultValue={[mines]}
            min={1}
            max={24}
            step={1}
            onValueChange={handleSliderChange}
            className={gamePhase !== "initial" ? "animate-pulse" : ""}
            rangeClassName={cn(
              "transition-colors duration-1000",
              mines > 20 && "from-[#FB2468] to-[#f4477e]"
            )}
          />
          <p className="text-[#9EA8DD]">24</p>
        </div>
      </div>

      {/* Place Bet Button */}
      <div className="grow flex justify-center items-end w-full">
        <Button
          className={cn(
            "from-[#85DAFF] to-60% font-bold to-[#5991FE] bg-gradient-to-br hover:bg-[#161f4b] w-full lg:h-16 lg:text-xl",
            betAmount <= 0 && "opacity-50 cursor-not-allowed",
            gamePhase === "initial" && betAmount > 0 && "hover:cursor-pointer",
            gamePhase === "running" &&
              "bg-[#1B265C] text-white hover:bg-[#161f4b]",
            (gamePhase === "cashOut" || gamePhase === "result:win") &&
              "bg-[#24FBB3] text-[#01021E] hover:bg-[#53ffdd]",
            (gamePhase === "bombed" || gamePhase === "result:lose") &&
              "bg-[#FB2468] hover:bg-[#FB2468] text-white hover:cursor-default"
          )}
          onClick={
            gamePhase === "cashOut"
              ? handleCashOut
              : gamePhase === "initial" && betAmount > 0
                ? handlePlaceBet
                : () => {}
          }
        >
          {gamePhase === "initial" &&
            `Place bet ${betAmount} ${displayCurrency.toUpperCase()}`}
          {gamePhase === "result:win" && `🎊`}
          {gamePhase === "result:lose" && `💣`}
          {gamePhase === "running" && "Select the cell"}
          {gamePhase === "cashOut" &&
            `Take ${(betAmount * currentMultiplier).toFixed(2)} ${displayCurrency.toUpperCase()}`}
          {gamePhase === "bombed" && "Bombed!"}
        </Button>
      </div>
    </div>
  );
}
