import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export class CreateUserDto {
    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({ example: 'jperez' })
    @IsString()
    username: string;
  }