/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/prisma.service';
import { GameState } from '@prisma/client';

const calcMultiplier = (
  game: { mines: number; betAmount: number },
  grid: { value: 'bomb' | 'gem'; revealed: boolean }[][],
) => {
  const maxGems = 25 - game.mines;
  const mines = game.mines;
  const gemsRevealed = grid
    .flat()
    .filter((cell) => cell.revealed && cell.value === 'gem').length;
  console.log(
    'Calculating multiplier:',
    `mines: ${mines}, gemsRevealed: ${gemsRevealed}, maxGems: ${maxGems}`,
    'Total win:',
    game.betAmount * Number((1 + gemsRevealed * (mines / maxGems)).toFixed(2)),
  );
  return Number((1 + gemsRevealed * (mines / maxGems)).toFixed(2));
};

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
    mode = 'real',
  }: {
    userId: string;
    rows: number;
    cols: number;
    mines: number;
    betAmount: number;
    session: string;
    mode?: 'demo' | 'real';
  }) {
    const grid = this.generateInitialGrid(rows, cols, mines);
    let game = await this.prisma.game.create({
      data: {
        userId,
        grid,
        state: GameState.AWAITING_FIRST_INPUT,
        mines,
        betAmount,
      },
    });

    if (mode === 'real') {
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
            amount: game.betAmount * 100,
            round_id: game.roundId,
            trx_id: game.betTRXId,
          }),
        },
      );

      const data = await response.json();
      if (data.status !== 200) {
        console.error(data);
        throw new Error('Failed to process bet with Mobule');
      } else {
        game = await this.prisma.game.update({
          where: { id: game.id },
          data: {
            backspin: data.response.backSpin,
          },
        });
        console.log('Bet processed successfully with Mobule', game.id);
      }
    }

    return {
      ...game,
      grid: this.getRevealedGrid(grid),
    };
  }

  // Reveal a cell and update the game state
  async revealCell(
    gameId: string,
    row: number,
    col: number,
    session: string,
    mode: 'demo' | 'real' = 'real',
  ) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');
    let grid = game.grid as { value: 'bomb' | 'gem'; revealed: boolean }[][];

    if (grid[row][col]?.revealed) throw new Error('Cell already revealed');
    grid[row][col].revealed = true;
    let newState = game.state;
    console.log(
      'Revealing cell at',
      row,
      col,
      'with value',
      grid[row][col].value,
      'isBackspin enabled:',
      game.backspin,
    );
    if (game.backspin) {
      // grid = grid.map((row) => {
      //   return row.map((cell) => {
      //     if (!cell.revealed) {
      //       cell.value = 'bomb';
      //     }
      //     return cell;
      //   });
      // });

      const totalRevealed = grid.flat().filter((cell) => cell.revealed).length;
      grid[row][col].value = 'gem'; // Always reveal as gem on backspin

      if (totalRevealed === 25 - game.mines) {
        // Convert all unrevealed cells to bombs
        grid.forEach((row) => {
          row.forEach((cell) => {
            if (!cell.revealed) {
              cell.value = 'bomb';
              cell.revealed = true; // Reveal all remaining cells
            }
          });
        });
        newState = GameState.VICTORY;
      }
    }

    if (grid[row][col].value === 'bomb') {
      newState = GameState.LOSE;
    } else {
      const allSafeCellsRevealed = grid.every((r) =>
        r.every((cell) => cell.value === 'bomb' || cell.revealed),
      );
      if (allSafeCellsRevealed) {
        newState = GameState.VICTORY;

        if (mode === 'real') {
          const multiplier = calcMultiplier(game, grid);

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
                amount: game.betAmount * 100 * multiplier,
                round_id: game.roundId,
                trx_id: game.winTRXId,
              }),
            },
          );

          const data = await response.json();
          if (data.status !== 200) {
            console.error(data);
            throw new Error('Failed to process win with Mobule');
          }
        }
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
  async cashOut(gameId: string, session: string, mode: 'demo' | 'real') {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');
    if (game.state === GameState.LOSE || game.state === GameState.VICTORY) {
      throw new Error('Game already ended');
    }
    const grid = game.grid as { value: 'bomb' | 'gem'; revealed: boolean }[][];
    // Reveal all cells
    const multiplier = calcMultiplier(game, grid);

    for (const row of grid) {
      for (const cell of row) {
        cell.revealed = true;
      }
    }
    await this.prisma.game.update({
      where: { id: gameId },
      data: { grid, state: GameState.VICTORY },
    });

    if (mode === 'real') {
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
            amount: game.betAmount * 100 * multiplier,
            round_id: game.roundId,
            trx_id: game.winTRXId,
          }),
        },
      );

      const data = await response.json();
      if (data.status !== 200) {
        console.error(data);
        throw new Error('Failed to process win with Mobule');
      }
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
