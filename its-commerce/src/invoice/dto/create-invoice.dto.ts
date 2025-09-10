import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateInvoiceDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceProductDto)
  products: InvoiceProductDto[];

  @IsNumber()
  @Min(0)
  total: number;

  @IsString()
  status?: string;
}

class InvoiceProductDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}




