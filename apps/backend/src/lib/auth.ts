import { betterAuth } from 'better-auth';
import { createPool } from 'mysql2/promise';
import { openAPI } from 'better-auth/plugins';
import { ConfigService } from '@nestjs/config';

export const createAuth = (configService: ConfigService) => {
  return betterAuth({
    database: createPool({
      database: configService.get<string>('database.database')!,
      port: configService.get<number>('database.port')!,
      user: configService.get<string>('database.username')!,
      password: configService.get<string>('database.password')!,
      host: configService.get<string>('database.host')!,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    plugins: [openAPI()],
    socialProviders: {
      google: {
        clientId: configService.get<string>('google.clientId')!,
        clientSecret: configService.get<string>('google.clientSecret')!,
        enabled: true,
        scopes: ['email', 'profile'],
        profile: true,
        accessType: 'offline',
        prompt: 'select_account consent',
      },
    },
    trustedOrigins: ['*'],
  });
};
