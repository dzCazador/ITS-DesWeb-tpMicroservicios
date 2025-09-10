import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveProductDto {
  @ApiProperty({ example: 3, description: 'ID del producto a agregar al carrito' })
  @IsInt()
  id: number;


}