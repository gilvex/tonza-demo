"use client";

import { useState, useEffect } from "react";
import { cn } from "@web/lib/utils";
import Image from "next/image";

// Define the types for the grid cells
type Cell = {
  isBomb: boolean;
  isRevealed: boolean;
  isGem: boolean;
};

export function MineGame() {
  const gridSize = 5; // 5x5 grid
  const totalCells = gridSize * gridSize;
  const bombCount = 5; // Number of bombs

  const [grid, setGrid] = useState<Cell[]>([]);
  const [isGameover, setGameover] = useState(false);
  console.log(grid);
  useEffect(() => {
    // Initialize the grid with default cells
    const newGrid: Cell[] = Array.from({ length: totalCells }, () => ({
      isBomb: false,
      isRevealed: false,
      isGem: false,
    }));

    // Place bombs randomly
    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      if (!newGrid[randomIndex].isBomb) {
        newGrid[randomIndex].isBomb = true;
        bombsPlaced++;
      }
    }

    // Mark non-bomb cells as gems
    newGrid.forEach((cell) => {
      if (!cell.isBomb) {
        cell.isGem = true;
      }
    });

    setGrid(newGrid);
  }, []);

  // Handle cell clicks
  const handleCellClick = (index: number) => {
    if (isGameover) return;

    const updatedGrid = [...grid];
    const cell = updatedGrid[index];

    // If the cell is a bomb, reveal all cells and end the game
    cell.isRevealed = true;

    if (cell.isBomb) {
      setGameover(true);
    }

    setGrid(updatedGrid);
  };

  return (
    <div className="bg-[#01021E] size-full aspect-square rounded-2xl max-h-[600px] p-5 grid grid-cols-5 gap-1.5 sm:gap-3">
      {grid.map((cell, index) => (
        <MineButton
          key={index}
          cell={cell}
          isGameover={isGameover}
          onClick={() => handleCellClick(index)}
        />
      ))}
    </div>
  );
}

// Props for MineButton component
interface MineButtonProps {
  cell: Cell;
  isGameover: boolean;
  onClick: () => void;
}

export function MineButton({ cell, isGameover, onClick }: MineButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false); // Track if the press was cancelled

  useEffect(() => {
    const handleMouseUp = () => {
      if (isPressed && !isCancelled) {
        setIsPressed(false);
        onClick(); // Fire onClick only if press was NOT cancelled
      } else {
        setIsPressed(false);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPressed, isCancelled, onClick]);

  return (
    <button
      disabled={cell.isRevealed || isGameover}
      onMouseDown={() => {
        setIsPressed(true);
        setIsCancelled(false); // Reset cancel state when mouseDown happens
      }}
      onMouseLeave={() => {
        if (isPressed) {
          setIsCancelled(true); // Mark as cancelled if mouse leaves before mouseUp
        }
      }}
      className={cn(
        `relative w-full aspect-[1/0.85] rounded-lg bg-blue-600 transition-all duration-200 flex items-center justify-center overflow-hidden`,
        cell.isRevealed || isGameover
          ? cell.isBomb
            ? "bg-[#01021E] border-2 border-[#FB2468] shadow-[0px_8px_0px_0px_rgba(251,36,104,0.44),inset_0_0_10px_5px_rgba(251,36,104,0.6)]"
            : "bg-[#183934] border-2 border-[#1ED80F] shadow-[0px_8px_0px_0px_rgba(30,216,15,0.68),inset_0_0_10px_5px_rgba(30,216,15,0.6)]"
          : isPressed
            ? "translate-y-1.5 shadow-[0px_0px_0px_0px_rgb(14,51,132)] bg-blue-700"
            : "translate-y-0 shadow-[0px_8px_0px_0px_rgb(14,51,132)]",
        isGameover && !cell.isRevealed ? "!opacity-40 pointer-events-none" : ""
      )}
    >
      {(isGameover || cell.isRevealed) && cell.isBomb && (
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          <Image priority src="/bomb.png" alt="bomb" width={64} height={64} />
        </div>
      )}
      {(isGameover || cell.isRevealed) && cell.isGem && (
        <div className="absolute inset-0 flex items-center justify-center p-[20%]">
          <Image priority src="/gem.png" alt="gem" width={64} height={64} />
        </div>
      )}
      {!isGameover && !cell.isRevealed && (
        <div className="flex justify-center items-center">
          <div className="bg-blue-400 rounded-full blur-lg size-10" />
        </div>
      )}
    </button>
  );
}
