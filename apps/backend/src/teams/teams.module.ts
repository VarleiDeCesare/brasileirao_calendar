import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { teamsProvider } from './repositories/teams-repository';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, teamsProvider],
})
export class TeamsModule {}
