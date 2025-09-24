import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main')
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Gateway - Microservicios')
    .setDescription('MS-Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu frontend de Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(envs.PORT);
  logger.log(`Gateway escuchando desde el puerto: ${envs.PORT}`);  
}
bootstrap();  