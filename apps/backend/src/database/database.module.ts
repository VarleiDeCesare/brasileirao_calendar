import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  providers: [
    ...databaseProviders.map((provider) => ({
      ...provider,
      inject: [ConfigService],
    })),
  ],
  exports: [...databaseProviders],
})
export class DatabaseModule {}

//need to inject the config service in the database provider
