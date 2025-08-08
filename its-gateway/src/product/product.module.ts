import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';

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

