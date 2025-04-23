import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt({ message: 'El id debe ser un número entero' }) // Valida que sea un entero
  @IsPositive({ message: 'El id debe ser un número positivo' }) // Valida que sea positivo
  id: number;
}