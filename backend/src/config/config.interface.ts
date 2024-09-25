export interface EnvironmentVariable {
  app: {
    port: number;
  };
  rabbitMqUrl: string;
  auth: {
    secret: string;
    refreshTokenSecret: string;
    refreshExpire: string;
    tokenExpire: string;
  };
}
