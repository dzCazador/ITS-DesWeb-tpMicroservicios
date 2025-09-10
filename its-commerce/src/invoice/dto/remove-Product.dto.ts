import { IsInt, IsPositive } from 'class-validator';

export class RemoveProductDto {
  @IsInt()
  id: number;
}