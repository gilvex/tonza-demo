/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  generateMinesInputSchema,
  generateMinesOutputSchema,
  resumeSessionInputSchema,
  resumeSessionOutputSchema,
} from './schema';

@TRPCRouter({ alias: 'game' })
export class Router {
  constructor(@Inject(Service) private readonly service: Service) {}

  @Mutation({
    input: generateMinesInputSchema,
    output: generateMinesOutputSchema,
  })
  @UseMiddlewares(ProtectedMiddleware)
  async generateMines(
    @Input() input: z.infer<typeof generateMinesInputSchema>,
  ) {
    try {
      return await this.service.generateMines(input);
    } catch (e) {
      console.error('Error generating mines:', e);
      throw new TRPCError({
        message: 'Failed to generate mines',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @Query({
    input: resumeSessionInputSchema,
    output: resumeSessionOutputSchema,
  })
  @UseMiddlewares(ProtectedMiddleware)
  async resumeSession(
    @Input() input: z.infer<typeof resumeSessionInputSchema>,
  ) {
    try {
      return await this.service.resumeSession(input.sessionId);
    } catch (e) {
      throw new TRPCError({ message: 'Session not found', code: 'NOT_FOUND' });
    }
  }

  @Mutation({
    input: z.object({
      sessionId: z.string(),
      row: z.number(),
      col: z.number(),
    }),
    output: z.object({
      sessionId: z.string(),
      grid: z.array(z.array(z.string())),
      status: z.string(),
    }),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async revealCell(
    @Input() input: { sessionId: string; row: number; col: number },
  ) {
    try {
      return await this.service.revealCell(
        input.sessionId,
        input.row,
        input.col,
      );
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to reveal cell',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  @Mutation({
    input: z.object({ sessionId: z.string() }),
    output: z.object({
      sessionId: z.string(),
      grid: z.array(z.array(z.string())),
      status: z.string(),
    }),
  })
  @UseMiddlewares(ProtectedMiddleware)
  async takeOut(@Input() input: { sessionId: string }) {
    try {
      return await this.service.takeOut(input.sessionId);
    } catch (e) {
      throw new TRPCError({
        message: e.message || 'Failed to take out',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
