import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [UserModule, ProductModule, InvoiceModule],
})
export class AppModule {}
