import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from 'src/common/models/rpc.model';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({ data: createUserDto });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new RpcException({
          error: 'NO SE PERMITEN VALORES DUPLICADOS (UNIQUE KEY)',
          statusCode: 409,
        });
      }
      throw new RpcException({ error, statusCode: 500 });
    }
  }



  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });

      if (!user) {
        throw new RpcException({
          error: 'User not found',
          statusCode: 404,
        } as RpcResponse);
      }

      return user;
    } catch (error) {
      throw new RpcException({
        error: error.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  /*

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
