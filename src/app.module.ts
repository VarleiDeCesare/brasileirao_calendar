import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database/database.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [DatabaseModule, MatchesModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
