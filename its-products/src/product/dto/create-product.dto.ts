import { IsString, IsNotEmpty, MaxLength, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    name: string;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number = 0;    
}
