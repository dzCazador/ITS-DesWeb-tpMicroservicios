import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Producto de ejemplo', description: 'Nombre del producto', maxLength: 500 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    name: string;

    @ApiProperty({ example: 99.99, description: 'Precio del producto', type: 'number', minimum: 0 })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;
}
