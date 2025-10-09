import { betterAuth } from 'better-auth';
import { createPool } from 'mysql2/promise';
import { openAPI } from 'better-auth/plugins';
import configuration from '../configs/configuration';

export const auth = betterAuth({
  database: createPool({
    database: configuration().database.database,
    port: configuration().database.port,
    user: configuration().database.username,
    password: configuration().database.password,
    host: configuration().database.host,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [openAPI()],
  basePath: '/auth',
  socialProviders: {
    google: {
      clientId: configuration().google.clientId,
      clientSecret: configuration().google.clientSecret,
      enabled: true,
      scopes: ['email', 'profile'],
      profile: true,
    },
  },
});
