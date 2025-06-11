import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
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
  mockBalance: number;
  setMockBalance: Dispatch<SetStateAction<number>>;
  revealedCells: number;
  setRevealedCells: Dispatch<SetStateAction<number>>;
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
  const [mockBalance, setMockBalance] = useState<number>(100000); // Mock balance for demo mode
  const [revealedCells, setRevealedCells] = useState<number>(0);

  const sessionValue =
    mode === "real"
      ? session
      : `${Math.random().toString(36).substring(2, 15)}`;

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        isLoading,
        setIsLoading,
        session: sessionValue,
        mode,
        mines,
        setMines,
        mockBalance,
        setMockBalance,
        revealedCells, 
        setRevealedCells
      }}
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
