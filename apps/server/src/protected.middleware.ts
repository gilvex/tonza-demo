/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import { Injectable } from '@nestjs/common';
// import { UserService } from './user.service';
// import { TRPCError } from '@trpc/server';

@Injectable()
export class ProtectedMiddleware implements TRPCMiddleware {
  // constructor(@Inject(UserService) private readonly userService: UserService) {}

  async use(opts: MiddlewareOptions<object>): Promise<MiddlewareResponse> {
    // Get userId from input
    // console.log('opts', opts.input, opts.meta, opts.rawInput);
    // const rawInput = opts.input as { userId?: string };
    // const userId = rawInput?.userId;

    // if (!userId) {
    //   throw new TRPCError({
    //     code: 'UNAUTHORIZED',
    //     message: 'Missing userId in input',
    //   });
    // }

    // const user = await this.userService.getUser(userId);
    // if (!user) {
    //   throw new TRPCError({
    //     code: 'UNAUTHORIZED',
    //     message: 'User not found',
    //   });
    // }

    // Attach user to context for downstream use
    return opts.next({
      ctx: {
        // user: { id: userId },
      },
    });
  }
}
