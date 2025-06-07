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
  } = useGameContext();
  const { checkSession, checkBalance, setMockBalance } =
    useMobuleWebhook({
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
    } else if (!lastUnfinishedGame.isLoading && !lastUnfinishedGame.data) {
      setIsLoading(false);
    }
  }, [
    game,
    lastUnfinishedGame.data,
    lastUnfinishedGame.isLoading,
    setGame,
    setIsLoading,
    setMines,
  ]);

  const multipliers = calculateMultipliers(mines);
  
  const currentMultiplier = useMemo(() => {
    if (!grid) return 1;
    return Math.max(0, grid.filter((cell) => cell.isGem && cell.isRevealed).length - 1);
  }, [grid]);

  return {
    game: game ? { ...game, grid } : null,
    isLoading,
    createGame: async (mines: number, betAmount: number) => {
      if (!session && mode === "real") {
        throw new Error("Session not found");
      }

      setIsLoading(true);
      const result = await createGame({
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
      if(mode === 'real') {
        await checkBalance.refetch()
      };
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
      // setMines(1);
    },
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
  } = useGame();
  const { setMockBalance } = useMobuleWebhook({ session, currency: "USD" });
  const api = useTRPC();
  const { mutateAsync: revealCell } = useMutation(
    api.game.revealCell.mutationOptions()
  );

  return {
    revealCell: async () => {
      if (!game || !session) {
        throw new Error("Game not found");
      }

      const result = await revealCell({
        gameId: game.id,
        row: Math.floor(cellId / 5),
        col: cellId % 5,
        session,
        mode,
      });

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
            game.betAmount * multipliers[currentMultiplier].factor * 100
        );
      }
    },
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
  const { mutateAsync: cashOut } = useMutation(
    api.game.cashOut.mutationOptions()
  );

  return {
    cashOut: async () => {
      if (!game || !session) {
        throw new Error("Game or session not found");
      }
      const result = await cashOut({
        gameId: game?.id,
        session,
        mode,
      });
      setMockBalance(
        (balance) =>
          balance + game.betAmount * multipliers[currentMultiplier].factor * 100
      ); // Add winnings to mock balance
      if(mode === 'real') {
        await checkBalance.refetch()
      };
      _setGame((game) => {
        if (!game) return null;
        return { ...game, state: GameState.VICTORY };
      });
      return result;
    },
  };
}
