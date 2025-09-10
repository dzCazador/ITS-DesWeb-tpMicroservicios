import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CartModule } from './cart/cart.module';


@Module({
  imports: [UserModule, ProductModule, InvoiceModule,CartModule],
})
export class AppModule {}
