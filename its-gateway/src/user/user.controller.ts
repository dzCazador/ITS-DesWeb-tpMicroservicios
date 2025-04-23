import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { MS_USER } from 'src/common/constants/user-ms.constant';
import { RpcResponse } from 'src/common/models/rpc.model';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(@Inject(MS_USER) private readonly userClient: ClientProxy) {}
  
  @Post()
  create(@Body() newUser: CreateUserDto) {

    return this.userClient.send({ users: 'create' }, { newUser }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),

    );
  }
}