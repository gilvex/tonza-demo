/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject } from '@nestjs/common';
import {
  Router as TRPCRouter,
  Query,
  Mutation,
  UseMiddlewares,
  Input,
} from 'nestjs-trpc';
import { Service } from './service';
import { ProtectedMiddleware } from '@server/protected.middleware';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

@TRPCRouter({ alias: 'game' })
export class Router {
  constructor(@Inject(Service) private readonly service: Service) {}

  // Create a new game
  @Mutation({
    input: z.object({
      userId: z.string(),
      rows: z.number(),
      cols: z.number(),
      mines: z.number(),
      betAmount: z.number(),
      session: z.string(),
    }),
    output: z.any(),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async createGame(
    @Input()
    input: {
      userId: string;
      rows: number;
      cols: number;
      mines: number;
      betAmount: number;
      session: string;
    },
  ) {
    try {
      return await this.service.createGame(input);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to create game',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  // Reveal a cell
  @Mutation({
    input: z.object({
      gameId: z.string(),
      row: z.number(),
      col: z.number(),
    }),
    output: z.object({
      gameId: z.string(),
      grid: z.array(z.array(z.string())),
      state: z.string(),
    }),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async revealCell(
    @Input() input: { gameId: string; row: number; col: number },
  ) {
    try {
      return await this.service.revealCell(input.gameId, input.row, input.col);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to reveal cell',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
  // Get last unfinished game for a user
  @Query({
    input: z.object({ userId: z.string() }),
    output: z
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
      .nullable(),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async getLastUnfinishedGame(@Input() input: { userId: string }) {
    try {
      return await this.service.getLastUnfinishedGame(input.userId);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to get last unfinished game',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  // Cash out
  @Mutation({
    input: z.object({ gameId: z.string(), session: z.string() }),
    output: z.object({
      gameId: z.string(),
      grid: z.array(z.array(z.string())),
      state: z.string(),
    }),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async cashOut(@Input() input: { gameId: string; session: string }) {
    try {
      return await this.service.cashOut(input.gameId, input.session);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to cash out',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  // Load last game for a user
  @Query({
    input: z.object({ userId: z.string() }),
    output: z
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
      .nullable(),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async loadLastGame(@Input() input: { userId: string }) {
    try {
      return await this.service.loadLastGame(input.userId);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to load last game',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
