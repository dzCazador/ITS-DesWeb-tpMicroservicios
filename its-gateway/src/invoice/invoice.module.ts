import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_INVOICE, MS_PRODUCT, MS_USER } from 'src/common/constants';
import { envs } from 'src/config';

@Module({
  controllers: [InvoiceController],
  imports: [
    ClientsModule.register([
      {
        name: MS_INVOICE,
        transport: Transport.TCP,
        options: {
          host: envs.MS_INVOICE_HOST,
          port: envs.MS_INVOICE_PORT,
        },
      },
      {
          name: MS_PRODUCT,
          transport: Transport.TCP,
          options: {
            host: envs.MS_PRODUCT_HOST,
            port: envs.MS_PRODUCT_PORT,
          },
      },
      {
          name: MS_USER,
          transport: Transport.TCP,
          options: {
            host: envs.MS_USER_HOST,
            port: envs.MS_USER_PORT,
          },
      },      
      
    ]),
  ],
})
export class InvoiceModule {}

