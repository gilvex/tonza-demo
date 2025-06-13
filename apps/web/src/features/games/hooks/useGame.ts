/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMobuleWebhook } from "./useMobuleWebhook";
import { useTRPC } from "@web/shared/trpc/client";
import { useCallback, useEffect } from "react";
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
  const maxGems = 25 - mines; // Total cells minus mines
  return Array.from({ length: maxGems }, (_, i) => ({
    value: `${(1 + (1 + i) * (mines / maxGems)).toFixed(2)}x`,
    factor: Number((1 + (1 + i) * (mines / maxGems)).toFixed(2)),
    borderColor: "#1A2340",
    backgroundColor: "transparent",
    growColor: "#1A2340",
  }));
};

export function useGame() {
  const api = useTRPC();
  const {
    game,
    setGame,
    isLoading,
    setIsLoading,
    session,
    mode = "demo",
    mines,
    setMines,
    revealedCells,
    setRevealedCells,
    initialGameFetched,
    setInitialGameFetched,
  } = useGameContext();
  const { checkSession, checkBalance, setMockBalance } = useMobuleWebhook({
    session,
  });
  const { mutateAsync } = useMutation(api.game.createGame.mutationOptions());

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
    if (initialGameFetched) return;
    if (!game && lastUnfinishedGame.data) {
      setGame({
        ...lastUnfinishedGame.data,
        state: lastUnfinishedGame.data.state as GameState,
      });
      setMines(lastUnfinishedGame.data.mines);
      setRevealedCells(
        lastUnfinishedGame.data.grid.filter((row: any) =>
          row.some((cell: any) => cell === "gem")
        ).length
      );
      setInitialGameFetched(true);
      setIsLoading(false);
    } else if (!lastUnfinishedGame.isLoading && !lastUnfinishedGame.data) {
      setIsLoading(false);
    }
  }, [
    game,
    initialGameFetched,
    lastUnfinishedGame.data,
    lastUnfinishedGame.isLoading,
    setGame,
    setInitialGameFetched,
    setIsLoading,
    setMines,
    setRevealedCells,
  ]);

  const multipliers = calculateMultipliers(mines);
  const createGame = useCallback(
    async (mines: number, betAmount: number) => {
      if (!session && mode === "real") {
        throw new Error("Session not found");
      }

      setIsLoading(true);
      const result = await mutateAsync({
        session: session || "",
        userId: checkSession.data?.id_player || "",
        mines,
        rows: 5,
        cols: 5,
        betAmount,
        mode,
      });
      setGame(result);
      setMockBalance((balance) => balance - betAmount * 100); // Deduct bet amount from mock balance
      if (mode === "real") {
        await checkBalance.refetch();
      }
      setIsLoading(false);
    },
    [
      checkBalance,
      checkSession.data?.id_player,
      mode,
      mutateAsync,
      session,
      setGame,
      setIsLoading,
      setMockBalance,
    ]
  );
  const resetGame = useCallback(() => {
    setGame(null);
    setRevealedCells?.(0);
    lastUnfinishedGame.refetch();
  }, [lastUnfinishedGame, setGame, setRevealedCells]);

  return {
    game: game ? { ...game, grid } : null,
    isLoading,
    mode,
    multipliers,
    currentMultiplier: revealedCells - 1,
    session,
    mines,
    createGame,
    setMines,
    resetGame,
    setRevealedCells,
    _setGame: setGame,
  };
}

export function useRevealCell({ cellId }: { cellId: number }) {
  const {
    game,
    _setGame,
    session,
    currentMultiplier,
    multipliers,
    mode = "demo",
    setRevealedCells,
  } = useGame();
  const { setMockBalance } = useMobuleWebhook({ session, currency: "USD" });
  const api = useTRPC();
  const { mutateAsync } = useMutation(api.game.revealCell.mutationOptions());

  const revealCell = useCallback(async () => {
    if (!game || !session) {
      throw new Error("Game not found");
    }

    const result = await mutateAsync({
      gameId: game.id,
      row: Math.floor(cellId / 5),
      col: cellId % 5,
      session,
      mode,
    });
    setRevealedCells((prev) => prev + 1);
    _setGame((prevGame) => {
      if (!prevGame) return null;
      return {
        ...prevGame,
        ...result,
        grid: result.grid as any,
        state: result.state as GameState,
      };
    });
    if (result.state === GameState.VICTORY) {
      setMockBalance(
        (balance) =>
          balance +
          game.betAmount * multipliers[currentMultiplier]?.factor * 100
      );
    }
  }, [
    _setGame,
    cellId,
    currentMultiplier,
    game,
    mode,
    multipliers,
    mutateAsync,
    session,
    setMockBalance,
    setRevealedCells,
  ]);

  return {
    revealCell,
  };
}

export function useCashOut() {
  const { game, _setGame, session, multipliers, currentMultiplier, mode } =
    useGame();
  const api = useTRPC();
  const { checkBalance, setMockBalance } = useMobuleWebhook({
    session,
    currency: "USD",
  });
  const { mutateAsync } = useMutation(api.game.cashOut.mutationOptions());

  const cashOut = useCallback(async () => {
    if (!game || !session) {
      throw new Error("Game or session not found");
    }
    const result = await mutateAsync({
      gameId: game?.id,
      session,
      mode,
    });

    if (mode === "real") {
      await checkBalance.refetch();
    } else {
      setMockBalance(
        (balance) =>
          balance +
          game.betAmount * multipliers[currentMultiplier]?.factor * 100
      ); // Add winnings to mock balance
    }

    _setGame((game) => {
      if (!game) return null;
      return {
        ...game,
        grid: result.grid as any,
        state: GameState.VICTORY,
      };
    });
    return result;
  }, [
    _setGame,
    mutateAsync,
    checkBalance,
    currentMultiplier,
    game,
    mode,
    multipliers,
    session,
    setMockBalance,
  ]);

  return {
    cashOut,
  };
}
