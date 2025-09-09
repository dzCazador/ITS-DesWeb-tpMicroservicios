import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';

// Función principal para iniciar el microservicio
async function bootstrap() {
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
  console.info(`Microservicio de productos escuchando en ${envs.PORT}`);
}
bootstrap();
