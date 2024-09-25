import { EnvironmentVariable } from './config.interface';

export default (): EnvironmentVariable => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
  },
  rabbitMqUrl: process.env.RABBITMQ_URL,
  auth: {
    refreshExpire: process.env.AUTH_REFRESH_EXPIRE || '7d', // Default refresh token expiration
    secret: process.env.AUTH_SECRET || 'defaultSecret', // Default secret (use proper env in production)
    refreshTokenSecret: process.env.AUTH_SECRET || 'defaultRefreshTokenSecret', // Default secret (use proper env in production)
    tokenExpire: process.env.AUTH_TOKEN_EXPIRE || '3600s', // Default access token expiration
  },
});
