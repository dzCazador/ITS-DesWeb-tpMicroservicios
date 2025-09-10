import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

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


/*
  @MessagePattern({invoices: 'remove'})
  remove(@Payload() id: string) {
    return this.invoiceService.remove(id);
  }*/
}
