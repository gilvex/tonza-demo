import { Module } from '@nestjs/common';
import { Service } from './service';
import { Router } from './router';
import { PrismaService } from '@server/prisma.service';

@Module({
  providers: [PrismaService, Service, Router],
  exports: [Router],
})
export class GameModule {}
