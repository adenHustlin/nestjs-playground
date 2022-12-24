import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from './config/winston.config';
import { LoggerInterceptor } from './common/interceptor/logger.interceptor';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });
  const reflector = app.get(Reflector);
  // Serialization interceptor
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  process.env.NODE_ENV === 'dev' &&
  app.useGlobalInterceptors(new LoggerInterceptor(new Logger()));

  await app.listen(3000);
}

bootstrap();
