/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { User } from './user.schema';

@Injectable()
export class UserService {
  async test(): Promise<string> {
    return 'test';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUser(userId: string): Promise<User> {
    return {
      name: 'user',
      email: 'user@email.com',
      password: '0000',
    };
  }
}
