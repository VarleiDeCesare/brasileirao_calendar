import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('database.host') || 'localhost',
        port: configService.get('database.port') || 3306,
        username: configService.get('database.username') || 'root',
        password: configService.get('database.password') || 'root',
        database:
          configService.get<string>('database.database') || 'brasileirao_dump',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
