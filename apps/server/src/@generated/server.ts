import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  users: t.router({
    getUserById: publicProcedure.input(z.object({ userId: z.string() })).output(z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  game: t.router({
    createGame: publicProcedure.input(z.object({
      userId: z.string(),
      rows: z.number(),
      cols: z.number(),
      mines: z.number(),
      betAmount: z.number(),
      session: z.string(),
      mode: z.enum(['demo', 'real']),
    })).output(z.any()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    revealCell: publicProcedure.input(z.object({
      gameId: z.string(),
      row: z.number(),
      col: z.number(),
      multiplier: z.number(),
      session: z.string(),
      mode: z.enum(['demo', 'real']),
    })).output(z.object({
      gameId: z.string(),
      grid: z.array(z.array(z.string())),
      state: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getLastUnfinishedGame: publicProcedure.input(z.object({ userId: z.string() })).output(z
      .object({
        userId: z.string(),
        mines: z.number(),
        id: z.string(),
        roundId: z.string(),
        grid: z.any(), // Using z.any() for JsonValue since it's a complex type
        state: z.string(), // Using z.string() for $Enums.GameState
        betTRXId: z.string(),
        winTRXId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        betAmount: z.number(),
      })
      .nullable()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    cashOut: publicProcedure.input(z.object({
      gameId: z.string(),
      session: z.string(),
      multiplier: z.number(),
      mode: z.enum(['demo', 'real']),
    })).output(z.object({
      gameId: z.string(),
      grid: z.array(z.array(z.string())),
      state: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    loadLastGame: publicProcedure.input(z.object({ userId: z.string() })).output(z
      .object({
        userId: z.string(),
        mines: z.number(),
        id: z.string(),
        roundId: z.string(),
        grid: z.any(), // Using z.any() for JsonValue since it's a complex type
        state: z.string(), // Using z.string() for $Enums.GameState
        betTRXId: z.string(),
        winTRXId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .nullable()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

