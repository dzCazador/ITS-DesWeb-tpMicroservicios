import { Module } from '@nestjs/common';

import { InvoiceController } from './invoice.controller';

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
    ]),
  ],
})
export class InvoiceModule {}

