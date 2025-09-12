import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_PRODUCT } from 'src/common/constants';
import { envs } from 'src/config';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService],
  imports: [
    ClientsModule.register([
      {
          name: MS_PRODUCT,
          transport: Transport.TCP,
          options: {
            host: envs.MS_PRODUCT_HOST,
            port: envs.MS_PRODUCT_PORT,
          },
      } 
    ]),
  ],
})
export class InvoiceModule {}