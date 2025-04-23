import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: envs.PORT,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Microservicio de Usuarios')
    .setDescription('Microservicio para la gestion de usuarios')
    .setVersion('1.0')
    .addTag('users')
    .build();
  //const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);
  //app.enableShutdownHooks();
  logger.log(`Microservicio escuchando desde le puerto: ${envs.PORT}`);
  await app.listen();
}
bootstrap();
