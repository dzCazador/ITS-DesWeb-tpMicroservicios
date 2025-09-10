import { IsInt, IsPositive } from 'class-validator';


export class AddProductDto {
  @IsInt()
  id: number;

  @IsPositive()
  quantity: number;

  @IsPositive()
  price: number;
}