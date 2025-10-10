import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { matchProviders } from './repositories/match-repository';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, ...matchProviders],
})
export class MatchesModule {}
