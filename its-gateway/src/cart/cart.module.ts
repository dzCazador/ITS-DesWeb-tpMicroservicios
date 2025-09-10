import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_INVOICE } from 'src/common/constants';
import { envs } from 'src/config';

@Module({
  controllers: [CartController],
      imports: [
        ClientsModule.register([
          {
            name: MS_INVOICE,
            transport: Transport.TCP,
            options: {
              host: envs.MS_INVOICE_HOST,
              port: envs.MS_INVOICE_PORT,
            },
          }
        ]),
      ],
})
export class CartModule {}
