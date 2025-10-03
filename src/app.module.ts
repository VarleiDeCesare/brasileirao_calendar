import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [MatchesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
