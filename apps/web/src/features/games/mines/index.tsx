"use client";

/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useEffect } from "react";
import { cn } from "@web/lib/utils";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { GameState, useRevealCell } from "../hooks/useGame";
import { useGame } from "../hooks/useGame";

export interface Cell {
  isBomb: boolean;
  isRevealed: boolean;
  isGem: boolean;
}

export function MineGame() {
  const [idleAnimationVariant, setIAV] = useState(
    Math.min(10, Math.max(1, Math.floor(Math.random() * 10)))
  );

  const { game, currentMultiplier, multipliers } = useGame();
  const multiplier = multipliers[currentMultiplier];

  useEffect(() => {
    setTimeout(() => {
      setIAV((iav) =>
        Math.min(Math.max(1, Math.random() > 0.5 ? iav - 1 : iav + 1), 10)
      );
    }, 60_000);
  }, [idleAnimationVariant]);

  // useEffect(() => {
  //   console.log("game grid in index.tsx", game?.grid);
  // }, [game]);

  return (
    <>
      {/* {<input
          type="number"
          max={10}
          min={1}
          onChange={(e) => {
            console.log(Number(e.target.value));
            setIAV(Number(e.target.value));
          }}
          value={idleAnimationVariant}
        />} */}

      <div className="bg-[#01021E] mx-auto w-full max-w-sm lg:max-w-xl aspect-square rounded-2xl p-5 grid grid-cols-5 gap-2 relative">
        {!game
          ? Array.from({ length: 25 }).map((_, index) => (
              <MineButton
                id={index}
                idleAnimationVariant={idleAnimationVariant}
                key={index}
                cell={{ isBomb: false, isGem: false, isRevealed: false }}
              />
            ))
          : game.grid.map((cell, index) => (
              <MineButton key={index} cell={cell} id={index} />
            ))}

        <AnimatePresence>
          {game && [GameState.VICTORY, GameState.LOSE].includes(game.state) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute bg-[#1D1E2599] border backdrop-blur-md h-32 text-center rounded-xl left-0 right-0 top-0 bottom-0 m-auto",
                game.state === GameState.VICTORY &&
                  "border-[#1ED80F] w-fit px-8",
                game.state === GameState.LOSE && "border-[#FB2468] w-44"
              )}
            >
              <div className="h-full w-full flex flex-col gap-2 justify-center items-center font-bold">
                <p
                  className={cn(
                    "text-4xl",
                    game.state === GameState.LOSE
                      ? "text-[#FB2468]"
                      : "text-[#1ED80F]"
                  )}
                >
                  {game.state === GameState.LOSE
                    ? "0x"
                    : multiplier?.value}
                </p>
                <p className="text-xl">
                  {game.state === GameState.LOSE
                    ? "You lose"
                    : `You win: ${(game.betAmount * multiplier?.factor).toFixed(2)} USD`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

interface MineButtonProps {
  id?: number;
  idleAnimationVariant?: number;
  cell: Cell;
}

export function MineButton({
  id = -1,
  idleAnimationVariant = 7,
  cell,
}: MineButtonProps) {
  const { game } = useGame();
  const { revealCell } = useRevealCell({ cellId: id });
  const [isPressed, setIsPressed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isPressed && !isCancelled) {
        setIsPressed(false);
        revealCell();
      } else {
        setIsPressed(false);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPressed, isCancelled, revealCell]);

  // Calculate our base HSL values.
  const saturation = 70;
  const lightness = 40 + (idleAnimationVariant / 25) * 30;

  // Determine if rainbow mode is active (e.g. when idleAnimationVariant equals 10)
  const rainbowMode = idleAnimationVariant === 10;

  // Use your original color when not in rainbow mode.
  const staticBackgroundColor = isPressed
    ? "rgb(29 78 216 / var(--tw-bg-opacity, 1))"
    : "";

  // When in rainbow mode, define a keyframe array of rainbow colors.
  const colorsRange = Array.from(
    { length: 25 },
    (_, i) => ((i / 24) * 360 + 213) % 360
  );
  const rainbowColors = colorsRange.map(
    (hue) => `hsl(${hue}, ${saturation}%, ${lightness}%)`
  );
  const shadowColors = colorsRange.map(
    (hue) => `0px 8px 0px 0px hsl(${hue}, ${saturation}%, ${lightness - 20}%)`
  );

  return (
    <motion.button
      disabled={
        !game ||
        [GameState.VICTORY, GameState.LOSE].includes(game.state) ||
        cell.isRevealed
      }
      onMouseDown={() => {
        setIsPressed(true);
        setIsCancelled(false);
      }}
      onMouseLeave={() => {
        if (isPressed) setIsCancelled(true);
      }}
      className={cn(
        `relative w-full aspect-[1/0.85] rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden`,
        cell.isRevealed
          ? cell.isBomb
            ? "bg-[#01021E] border-2 border-[#FB2468] !shadow-[0px_8px_0px_0px_rgba(251,36,104,0.44),inset_0_0_10px_5px_rgba(251,36,104,0.6)]"
            : "bg-[#183934] border-2 border-[#1ED80F] !shadow-[0px_8px_0px_0px_rgba(30,216,15,0.68),inset_0_0_10px_5px_rgba(30,216,15,0.6)]"
          : "",
        cell.isRevealed ? "!opacity-40 pointer-events-none" : "",
        !game ? `hover:cursor-default animate-pulse duration-[2s]` : ""
      )}
      animate={{
        animationDelay: !game
          ? `${Math.min(id / idleAnimationVariant, 25)}s`
          : "0",
        backgroundColor: rainbowMode ? rainbowColors : staticBackgroundColor,
        boxShadow: rainbowMode
          ? shadowColors
          : isPressed
            ? "0px 0px 0px 0px rgb(14,51,132)"
            : "0px 8px 0px 0px rgb(14,51,132)",
        translateY: isPressed ? "0.375rem" : "0rem",
      }}
      transition={{
        backgroundColor: rainbowMode
          ? {
              duration: 4,
              ease: "linear",
              repeat: Infinity,
              delay: id,
            }
          : { duration: 0.2 },
        boxShadow: rainbowMode
          ? {
              duration: 4,
              ease: "linear",
              repeat: Infinity,
              delay: id,
            }
          : { duration: 0.2 },
        default: { duration: 0.2 },
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: cell.isGem ? 1 : 0,
        }}
        className="absolute inset-0 flex items-center justify-center p-[20%]"
      >
        <Image
          priority
          src={"/gem.png"}
          alt={"gem"}
          width={64}
          height={64}
          className="select-none"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: cell.isBomb ? 1 : 0,
        }}
        className="absolute inset-0 flex items-center justify-center p-[20%]"
      >
        <Image
          priority
          src={"/bomb.png"}
          alt={"bomb"}
          width={64}
          height={64}
          className="select-none"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: !cell.isRevealed ? 1 : 0 }}
        className="flex justify-center items-center"
      >
        <div
          className={`${id + 1 && rainbowMode ? "" : "bg-blue-400"} rounded-full blur-lg min-w-10 min-h-10 absolute inset-0`}
        />
      </motion.div>
    </motion.button>
  );
}
