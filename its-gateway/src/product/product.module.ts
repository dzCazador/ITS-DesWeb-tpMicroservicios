import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_PRODUCT } from 'src/common/constants';
import { envs } from 'src/config';

@Module({
  controllers: [ProductController],
  imports: [
    ClientsModule.register([
      {
        name: MS_PRODUCT,
        transport: Transport.TCP,
        options: {
          host: envs.MS_PRODUCT_HOST,
          port: envs.MS_PRODUCT_PORT,
        },
      },
    ]),
  ],
})
export class ProductModule {}

