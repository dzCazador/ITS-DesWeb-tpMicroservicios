import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class CreateInvoiceDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que realiza la compra' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: [{ id: 3, price: 99.99, quantity: 2 }], description: 'Lista de productos en la factura', type: 'array', items: { type: 'object' } })  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceProductDto)
  products: InvoiceProductDto[];

  @ApiProperty({ example: 199.98, description: 'Total de la factura', type: 'number', minimum: 0 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 'pendiente', description: 'Estado de la factura', required: false })
  @IsString()
  status?: string;
}

class InvoiceProductDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 99.99, description: 'Precio del producto', type: 'number', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 2, description: 'Cantidad del producto', type: 'number', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}


