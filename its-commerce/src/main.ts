import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

// Función principal para iniciar el microservicio
async function bootstrap() {
    const logger = new Logger('Main');
  // Crear el microservicio con configuración TCP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: envs.HOST,
      port: envs.PORT,
    },
  });

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe());

  // Iniciar el microservicio
  await app.listen();
  logger.log(`Microservicio de Comercio escuchando en ${envs.PORT}`);
}
bootstrap();
