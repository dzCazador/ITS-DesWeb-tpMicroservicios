import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main')
  const app = await NestFactory.create(AppModule);

  logger.log(`Gateway escuchando desde el puerto: ${envs.PORT}`);
  await app.listen(envs.PORT);
}
bootstrap();  