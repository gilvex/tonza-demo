import { Module } from '@nestjs/common';
import { UserRouter } from './user.router';
import { TRPCModule } from 'nestjs-trpc';
import { UserService } from './user.service';
import { ProtectedMiddleware } from './protected.middleware';
import { AppContext } from './app.context';
import { TrpcPanelController } from './trpc-panel.controller';
import { GameModule } from './game/module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV === 'production' ? undefined : './src/@generated',
      context: AppContext,
    }),
    ConfigModule.forRoot(),
    GameModule,
  ],
  controllers: [TrpcPanelController],
  providers: [UserRouter, AppContext, UserService, ProtectedMiddleware],
})
export class AppModule {}
