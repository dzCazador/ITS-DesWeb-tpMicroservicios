import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {IsNumber, IsPositive,IsOptional} from 'class-validator'
import {Type} from 'class-transformer'

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNumber() //Es un numero
    @IsPositive() // Positovo
    @IsOptional() // Opcional
    @Type(() => Number)
    id?: number;
}
