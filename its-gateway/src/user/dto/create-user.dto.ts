import { IsString, IsEmail, MinLength, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';


export class CreateUserDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;


  @ApiProperty({ example: 'mail@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'El password debe ser de al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: Role.ADMIN, enum: Role, default: Role.USER })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}