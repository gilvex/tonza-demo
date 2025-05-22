import { createContext, useContext, ReactNode, useState, SetStateAction, Dispatch } from "react";
import { GameState as GameStateType } from "../hooks/useGame";

export interface GameState {
  userId: string;
  mines: number;
  state: GameStateType;
  id: string;
  roundId: string;
  betTRXId: string;
  winTRXId: string;
  createdAt: string;
  updatedAt: string;
  grid?: {
    isBomb: boolean;
    isRevealed: boolean;
    isGem: boolean;
  }[];
  betAmount: number;
}

interface GameContextType {
  game: GameState | null;
  setGame: Dispatch<SetStateAction<GameState | null>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  session?: string | null;
  mode?: "demo" | "real";
  mines: number;
  setMines: Dispatch<SetStateAction<number>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({
  children,
  session,
  mode,
}: {
  children: ReactNode;
  session?: string | null;
  mode?: "demo" | "real";
}) {
  const [game, setGame] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mines, setMines] = useState(1);  

  return (
    <GameContext.Provider
      value={{ game, setGame, isLoading, setIsLoading, session, mode, mines, setMines }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
