const port = parseInt(process.env.PORT || '3333', 10);

export default () => ({
  env: process.env.NODE_ENV || 'development',
  port,
  app_base_url: process.env.APP_BASE_URL || `http://localhost:${port}`,
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'brasileirao_dump',
  },
  logger: {
    level: process.env.LOG_LEVEL || 'error',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
});
