/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/prisma.service';

@Injectable()
export class Service {
  constructor(private prisma: PrismaService) {}

  // Generate a new mines grid and create a session
  async generateMines({
    userId,
    rows,
    cols,
    mines,
    backspin,
  }: {
    userId: string;
    rows: number;
    cols: number;
    mines: number;
    backspin?: boolean;
  }) {
    const grid: { value: 'bomb' | 'success'; revealed: boolean }[][] =
      Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          value: 'success',
          revealed: false,
        })),
      );

    if (!backspin) {
      const total = rows * cols;
      const cells = Array(total).fill('success');
      for (let i = 0; i < mines; i++) cells[i] = 'bomb';
      for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid[r][c].value = cells[r * cols + c] as 'bomb' | 'success';
        }
      }
    }

    const session = await this.prisma.session.upsert({
      where: { userId: Number(userId) },
      update: {
        state: { grid, backspin: !!backspin, status: 'awaiting first input' },
      },
      create: {
        userId: Number(userId),
        state: { grid, backspin: !!backspin, status: 'awaiting first input' },
      },
    });

    return {
      sessionId: session.id,
      grid: this.getRevealedGrid(grid),
      status: 'awaiting first input',
    };
  }

  // Reveal a cell and update the game state
  async revealCell(userId: string, row: number, col: number) {
    const session = (await this.prisma.session.findUnique({
      where: { userId: Number(userId) },
    })) as {
      id: number;
      state: {
        grid: { value: 'bomb' | 'success'; revealed: boolean }[][];
        backspin: boolean;
        status: string;
      } | null;
    };

    if (!session) throw new Error('Session not found');
    if (!session.state) throw new Error('Session state is null');

    const { grid, backspin, status } = session.state;

    if (status === 'failure' || status === 'fullwin') {
      throw new Error('Game has already ended');
    }

    if (grid[row][col].revealed) throw new Error('Cell already revealed');
    grid[row][col].revealed = true;

    if (backspin) {
      if (grid[row][col].value === 'bomb') {
        // Replace bomb with success in backspin mode
        grid[row][col].value = 'success';
      }

      const allSafeCellsRevealed = grid.every((r) =>
        r.every((cell) => cell.value === 'bomb' || cell.revealed),
      );
      if (allSafeCellsRevealed) {
        session.state.status = 'fullwin';
      } else {
        session.state.status = 'success';
      }
    } else {
      if (grid[row][col].value === 'bomb') {
        session.state.status = 'failure';
      } else {
        const allSafeCellsRevealed = grid.every((r) =>
          r.every((cell) => cell.value === 'bomb' || cell.revealed),
        );
        if (allSafeCellsRevealed) {
          session.state.status = 'fullwin';
        } else {
          session.state.status = 'success';
        }
      }
    }

    await this.prisma.session.update({
      where: { userId: Number(userId) },
      data: { state: { grid, backspin, status: session.state.status } },
    });

    return {
      sessionId: session.id,
      grid: this.getRevealedGrid(
        grid,
        ['failure', 'fullwin'].includes(session.state.status),
      ),
      status: session.state.status,
    };
  }

  async takeOut(userId: string) {
    const session = (await this.prisma.session.findUnique({
      where: { userId: Number(userId) },
    })) as {
      id: number;
      state: {
        grid: { value: 'bomb' | 'success'; revealed: boolean }[][];
        backspin: boolean;
        status: string;
      } | null;
    };

    if (!session) throw new Error('Session not found');
    if (!session.state) throw new Error('Session state is null');

    const { grid, backspin } = session.state;

    if (backspin) {
      // Reveal unclicked cells as bombs up to the possible mines count
      let remainingMines = grid
        .flat()
        .filter((cell) => cell.value === 'bomb').length;
      for (const row of grid) {
        for (const cell of row) {
          if (!cell.revealed && remainingMines > 0) {
            cell.value = 'bomb';
            cell.revealed = true;
            remainingMines--;
          }
        }
      }
    }

    session.state.status = 'success';

    await this.prisma.session.update({
      where: { userId: Number(userId) },
      data: { state: session.state },
    });

    return {
      sessionId: session.id,
      grid: this.getRevealedGrid(session.state.grid, true),
      status: session.state.status,
    };
  }

  // Resume a session by userId
  async resumeSession(userId: string) {
    const session = (await this.prisma.session.findUnique({
      where: { userId: Number(userId) },
    })) as {
      id: number;
      state: {
        grid: { value: 'bomb' | 'success'; revealed: boolean }[][];
        status: string;
      } | null;
    };

    if (!session) throw new Error('Session not found');
    if (!session.state) throw new Error('Session state is null');

    return {
      sessionId: session.id,
      grid: this.getRevealedGrid(session.state.grid),
      status: session.state.status,
    };
  }

  // Helper method to return only revealed cells
  private getRevealedGrid(
    grid: { value: 'bomb' | 'success'; revealed: boolean }[][],
    hideNone = false,
  ) {
    return grid.map((row) =>
      row.map((cell) => (cell.revealed || hideNone ? cell.value : 'hidden')),
    );
  }
}
