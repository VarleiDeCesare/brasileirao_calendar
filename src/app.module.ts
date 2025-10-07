import { Module } from '@nestjs/common';
import { MatchesModule } from './matches/matches.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, MatchesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
