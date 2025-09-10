import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto,UpdateInvoiceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class InvoiceService {
  constructor(
    private readonly prismaService: PrismaService    
  ){}

  async create(createInvoice: CreateInvoiceDto) {
    return await this.prismaService.invoice.create({
      data: {
        ...createInvoice,
        products: JSON.parse(JSON.stringify(createInvoice.products)), 
      },
    });
}

  findAll() {
        return this.prismaService.invoice.findMany();
  }

  findOne(id: string) {
        return this.prismaService.invoice.findUnique({ where: { id } });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
        return this.prismaService.invoice.update({ 
          where: { id }, 
          data: {
            ...updateInvoiceDto,
            products: updateInvoiceDto.products ? JSON.parse(JSON.stringify(updateInvoiceDto.products)) : undefined,
          } 
        });
  }

  remove(id: string) {
        return this.prismaService.invoice.delete({ where: { id } });
  }

}
