import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { readFileSync } from 'fs';
// import { resolve } from 'path';

async function bootstrap() {
  // const httpsOptions = {
  //   cert: readFileSync(resolve('tma.internal.pem')),
  //   key: readFileSync(resolve('tma.internal-key.pem')),
  // };

  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(process.env.PORT ?? 14001);
}

void bootstrap();
