import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto,UpdateInvoiceDto, AddProductDto, RemoveProductDto } from './dto';


@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // Invoices Patterns
  @MessagePattern({invoices: 'create'})
  create(@Payload('newInvoice') newInvoice: CreateInvoiceDto) {
    return this.invoiceService.create(newInvoice);
  }

  @MessagePattern({invoices: 'findAll'})
  findAll() {
    return this.invoiceService.findAll();
  }

  @MessagePattern({invoices: 'findUserInvoices'})
  findUserInvoices(@Payload() userId: number) {
    return this.invoiceService.findUserInvoices(userId);
  }


  @MessagePattern({invoices: 'findOne'})
  findOne(@Payload() id: string) {
    return this.invoiceService.findOne(id);
  }

  @MessagePattern({invoices: 'update'})
  update(@Payload() data: { id: string; updateInvoice: UpdateInvoiceDto }) {
    const { id, updateInvoice } = data;
    return this.invoiceService.update(id, updateInvoice);
  }

  // Cart Patterns
  @MessagePattern({cart: 'create'})
  createCart(@Payload('newInvoice') newInvoice: CreateInvoiceDto) {
    return this.invoiceService.create(newInvoice);
  }

  @MessagePattern({cart: 'addProduct'})
  addProductToCart(@Payload() data: { id: string; addProduct: AddProductDto }) {
    const { id, addProduct } = data;
    return this.invoiceService.addProductToCart(id, addProduct);
  }

  @MessagePattern({cart: 'removeProduct'})
  removeProductFromCart(@Payload() data: { id: string; removeProduct: RemoveProductDto }) {
    const { id, removeProduct } = data;
    return this.invoiceService.removeProductFromCart(id, removeProduct);
  }

  /* USER CART PATTERNS */
  
  @MessagePattern({cart: 'getUserCart'})
  getUserCart(@Payload() userId: number ) {
    return this.invoiceService.getUserCart(userId);
  }

  @MessagePattern({cart: 'createUserCart'})
  createUserCart(@Payload() userId: number ) {
    return this.invoiceService.createUserCart(userId);
  }


  @MessagePattern({cart: 'finelizeUserCart'})
  finelizeUserCart(@Payload() userId: number ) {
    return this.invoiceService.finalizeUserCart(userId);
  }

  @MessagePattern({cart: 'addProductToUserCart'})
  async addProductToUserCart(@Payload() data: { userId: number; addProduct: AddProductDto }) {
    const cart = await this.invoiceService.getUserCart(data.userId);
    return this.invoiceService.addProductToCart(cart.id, data.addProduct);
  }

  @MessagePattern({cart: 'removeProductFromUserCart'})
  async removeProductFromUserCart(@Payload() data: { userId: number; removeProduct: RemoveProductDto }) {
    const cart = await this.invoiceService.getUserCart(data.userId);
    return this.invoiceService.removeProductFromCart(cart.id, data.removeProduct);
  }


}
