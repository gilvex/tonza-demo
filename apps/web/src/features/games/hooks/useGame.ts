/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMobuleWebhook } from "./useMobuleWebhook";
import { useTRPC } from "@web/shared/trpc/client";
import { useEffect, useMemo } from "react";
import { convertServerGrid } from "../mines/lib/helper";
import { useGameContext } from "../context/GameContext";
import { Multiplier } from "../mines/lib/types";

export enum GameState {
  AWAITING_FIRST_INPUT = "AWAITING_FIRST_INPUT",
  LOSE = "LOSE",
  CASH_OUT_AVAILABLE = "CASH_OUT_AVAILABLE",
  VICTORY = "VICTORY",
  FINISHED = "FINISHED",
}

const calculateMultipliers = (mines: number): Multiplier[] => {
  const maxGems = 24 - mines; // Total cells minus mines
  return Array.from({ length: maxGems }, (_, i) => ({
    value: `${(1 + ((1 + i) * (mines / (24 - mines)))).toFixed(2)}x`,
    factor: Number((1 + ((1 + i) * (mines / (24 - mines)))).toFixed(2)),
    borderColor: "#1A2340",
    backgroundColor: "transparent",
    growColor: "#1A2340",
  }));
};

export function useGame() {
  const api = useTRPC();
  const { game, setGame, isLoading, setIsLoading, session, mode, mines, setMines } =
    useGameContext();
  const { checkSession } = useMobuleWebhook({
    session,
  });
  const { mutateAsync: createGame } = useMutation(
    api.game.createGame.mutationOptions()
  );

  const grid = convertServerGrid((game?.grid as unknown as string[][]) ?? []);

  const lastUnfinishedGame = useQuery(
    api.game.getLastUnfinishedGame.queryOptions(
      {
        userId: checkSession.data?.id_player || "",
      },
      {
        enabled: !!checkSession.data?.id_player,
      }
    )
  );

  useEffect(() => {
    if (!game && lastUnfinishedGame.data) {
      setGame({
        ...lastUnfinishedGame.data,
        state: lastUnfinishedGame.data.state as GameState,
      });
      setMines(lastUnfinishedGame.data.mines);
      setIsLoading(false);
    }
  }, [game, lastUnfinishedGame.data, setGame, setIsLoading, setMines]);

  const multipliers = calculateMultipliers(mines);

  const currentMultiplier = useMemo(() => {
    if (!grid) return 1;
    return grid.filter((cell) => cell.isGem && cell.isRevealed).length - 1;
  }, [grid]);

  return {
    game: game ? { ...game, grid } : null,
    isLoading,
    createGame: async (mines: number, betAmount: number) => {
      if (!session) {
        throw new Error("Session not found");
      }
      
      setIsLoading(true);
      const result = await createGame({
        session,
        userId: checkSession.data?.id_player || "",
        mines,
        rows: 5,
        cols: 5,
        betAmount,
      });
      setGame(result);
      setIsLoading(false);
    },
    _setGame: setGame,
    mode,
    multipliers,
    currentMultiplier,
    session,
    mines,
    setMines,
    resetGame: () => {
      setGame(null);
      setMines(1);
    },
  };
}

export function useRevealCell({ cellId }: { cellId: number }) {
  const { game, setGame } = useGameContext();
  const api = useTRPC();
  const { mutateAsync: revealCell } = useMutation(
    api.game.revealCell.mutationOptions()
  );

  return {
    revealCell: async () => {
      if (!game) {
        throw new Error("Game not found");
      }

      const result = await revealCell({
        gameId: game.id,
        row: Math.floor(cellId / 5),
        col: cellId % 5,
      });

      setGame((prevGame) => {
        if (!prevGame) return null;
        return {
          ...prevGame,
          ...result,
          grid: result.grid as any,
          state: result.state as GameState,
        };
      });
    },
  };
}

export function useCashOut() {
  const { game, setGame, session } = useGameContext();
  const api = useTRPC();
  const { mutateAsync: cashOut } = useMutation(
    api.game.cashOut.mutationOptions()
  );

  return {
    cashOut: async () => {
      if (!game || !session) {
        throw new Error("Game or session not found");
      }
      const result = await cashOut({ gameId: game?.id, session });
      setGame({ ...game, state: GameState.VICTORY });
      return result;
    },
  };
}
