import { Inject } from '@nestjs/common';
import {
  Router,
  Query,
  UseMiddlewares,
  Input,
  Ctx,
  Options,
  ProcedureOptions,
} from 'nestjs-trpc';
import { Service } from './service';
import { ProtectedMiddleware } from '@server/protected.middleware';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { xSchema } from './schema';

@Router({ alias: 'users' })
export class UserRouter {
  constructor(@Inject(Service) private readonly service: Service) {}

  @Query({
    input: z.object({ userId: z.string() }),
    output: xSchema,
  })
  @UseMiddlewares(ProtectedMiddleware)
  async getUserById(
    @Input('userId') userId: string,
    @Ctx() ctx: object,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Options() opts: ProcedureOptions,
  ) {
    const x = await this.service.getX(userId);
    // console.log(ctx);
    if (!ctx) {
      throw new TRPCError({
        message: 'Could not find x.',
        code: 'NOT_FOUND',
      });
    }

    return x;
  }
}
