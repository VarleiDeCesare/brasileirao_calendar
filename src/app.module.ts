import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { ConfigModule } from '@nestjs/config';
import configuration from './configs/configuration';
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
    AuthModule.forRoot({
      auth,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
