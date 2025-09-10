import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto,UpdateInvoiceDto, AddProductDto, RemoveProductDto } from './dto';


@Controller()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern({invoices: 'create'})
  create(@Payload('newInvoice') newInvoice: CreateInvoiceDto) {
    return this.invoiceService.create(newInvoice);
  }

  @MessagePattern({invoices: 'findAll'})
  findAll() {
    return this.invoiceService.findAll();
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
  removeProductToCart(@Payload() data: { id: string; removeProduct: RemoveProductDto }) {
    const { id, removeProduct } = data;
    return this.invoiceService.removeProductFromCart(id, removeProduct);
  }


  

/*
  @MessagePattern({invoices: 'remove'})
  remove(@Payload() id: string) {
    return this.invoiceService.remove(id);
  }*/
}
