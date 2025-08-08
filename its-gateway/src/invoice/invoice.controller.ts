import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { MS_INVOICE } from 'src/common/constants';

@Controller()
export class InvoiceController {
  constructor(@Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy) {}
/*
  @MessagePattern('createInvoice')
  create(@Payload() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @MessagePattern('findAllInvoice')
  findAll() {
    return this.invoiceService.findAll();
  }

  @MessagePattern('findOneInvoice')
  findOne(@Payload() id: number) {
    return this.invoiceService.findOne(id);
  }

  @MessagePattern('updateInvoice')
  update(@Payload() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(updateInvoiceDto.id, updateInvoiceDto);
  }

  @MessagePattern('removeInvoice')
  remove(@Payload() id: number) {
    return this.invoiceService.remove(id);
  } */
}
