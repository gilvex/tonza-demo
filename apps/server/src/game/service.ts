/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class Service {
  async test(): Promise<string> {
    return 'test';
  }

  async getX(X: string) {
    return { X };
  }
}
