/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/prisma.service';
import { GameState } from '@prisma/client';

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  // Create a new game
  async createGame({
    userId,
    rows,
    cols,
    mines,
    betAmount,
    session,
  }: {
    userId: string;
    rows: number;
    cols: number;
    mines: number;
    betAmount: number;
    session: string;
  }) {
    const grid = this.generateInitialGrid(rows, cols, mines);
    const game = await this.prisma.game.create({
      data: {
        userId,
        grid,
        state: GameState.AWAITING_FIRST_INPUT,
        mines,
        betAmount,
      },
    });

    const response = await fetch(
      `${process.env.CENTRAL_API}/api/mobule/withdraw.bet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: session,
          'game.provider': 'tonza',
          currency: 'USD',
          amount: game.betAmount,
          round_id: game.roundId,
          trx_id: game.betTRXId,
        }),
      },
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to process bet with Mobule');
    }

    return {
      ...game,
      grid: this.getRevealedGrid(grid),
    };
  }

  // Reveal a cell and update the game state
  async revealCell(gameId: string, row: number, col: number) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');
    const grid = game.grid as { value: 'bomb' | 'gem'; revealed: boolean }[][];

    if (grid[row][col]?.revealed) throw new Error('Cell already revealed');
    grid[row][col].revealed = true;
    let newState = game.state;
    if (grid[row][col].value === 'bomb') {
      newState = GameState.LOSE;
    } else {
      const allSafeCellsRevealed = grid.every((r) =>
        r.every((cell) => cell.value === 'bomb' || cell.revealed),
      );
      if (allSafeCellsRevealed) {
        newState = GameState.VICTORY;
      } else {
        newState = GameState.CASH_OUT_AVAILABLE;
      }
    }
    await this.prisma.game.update({
      where: { id: gameId },
      data: { grid, state: newState },
    });
    return {
      gameId: game.id,
      grid: this.getRevealedGrid(grid),
      state: newState,
    };
  }

  // Cash out (end the game with a win if not already lost)
  async cashOut(gameId: string, session: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');
    if (game.state === GameState.LOSE || game.state === GameState.VICTORY) {
      throw new Error('Game already ended');
    }
    const grid = game.grid as { value: 'bomb' | 'gem'; revealed: boolean }[][];
    // Reveal all cells
    for (const row of grid) {
      for (const cell of row) {
        cell.revealed = true;
      }
    }
    await this.prisma.game.update({
      where: { id: gameId },
      data: { grid, state: GameState.VICTORY },
    });

    const response = await fetch(
      `${process.env.CENTRAL_API}/api/mobule/deposit.win`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: session,
          'game.provider': 'tonza',
          currency: 'USD',
          amount: game.betAmount,
          round_id: game.roundId,
          trx_id: game.winTRXId,
        }),
      },
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error('Failed to process win with Mobule');
    }

    return {
      gameId: game.id,
      grid: this.getRevealedGrid(grid, true),
      state: GameState.VICTORY,
    };
  }

  // Load the last game for a user
  async loadLastGame(userId: string) {
    return this.prisma.game.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLastUnfinishedGame(userId: string) {
    const lastGame = await this.loadLastGame(userId);
    if (!lastGame || !this.isGameUnfinished(lastGame)) {
      return null;
    }
    return {
      ...lastGame,
      grid: this.getRevealedGrid(
        lastGame.grid as { value: 'bomb' | 'gem'; revealed: boolean }[][],
      ),
    };
  }
  // Check if a game is unfinished
  isGameUnfinished(game: any) {
    return [
      GameState.AWAITING_FIRST_INPUT,
      GameState.CASH_OUT_AVAILABLE,
    ].includes(game.state);
  }

  // Helper: generate initial grid
  private generateInitialGrid(rows: number, cols: number, mines: number) {
    const grid: { value: 'bomb' | 'gem'; revealed: boolean }[][] = Array.from(
      { length: rows },
      () =>
        Array.from({ length: cols }, () => ({ value: 'gem', revealed: false })),
    );
    const total = rows * cols;
    const cells = Array(total).fill('gem');
    for (let i = 0; i <= mines; i++) cells[i] = 'bomb';
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid[r][c].value = cells[r * cols + c] as 'bomb' | 'gem';
      }
    }
    return grid;
  }

  // Helper: return only revealed cells
  private getRevealedGrid(
    grid: { value: 'bomb' | 'gem'; revealed: boolean }[][],
    revealAll = false,
  ) {
    return grid.map((row) =>
      row.map((cell) => (cell.revealed || revealAll ? cell.value : 'hidden')),
    );
  }
}
