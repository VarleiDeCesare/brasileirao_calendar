import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { createAuth } from './lib/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configs/configuration';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    MatchesModule,
    TeamsModule,
    AuthModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        auth: createAuth(configService),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
