import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductDto {
  @ApiProperty({ example: 3, description: 'ID del producto a agregar al carrito' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 2, description: 'Cantidad del producto a agregar, debe ser positiva' })
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 150.75, description: 'Precio del producto a agregar' })
  @IsPositive()
  price: number;
}