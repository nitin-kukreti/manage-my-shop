import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from './config/config.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning();
  const configService =
    app.get<ConfigService<EnvironmentVariable>>(ConfigService);
  const port = configService.get('app.port', { infer: true });
  console.log('port', port);
  const config = new DocumentBuilder()
    .setTitle('Manage-My-Shop')
    .setDescription('The Manage-My-Shop API Document')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'jwt',
        scheme: 'bearer',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'jwt',
        scheme: 'bearer',
      },
      'refresh-access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  registerGlobals(app);
  await app.listen(port);
}

export function registerGlobals(app: INestApplication) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );
}

bootstrap();
