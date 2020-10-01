import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT');
  const corsOrigin = configService.get<string>('CORS_ORIGIN')

  app.use(helmet());

  // Cada site de origem é separado por virgula
  app.enableCors({ origin: corsOrigin.split(',') })

  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}

bootstrap();
