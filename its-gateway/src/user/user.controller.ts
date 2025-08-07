import {Controller,Post,Get,Body,Param,Patch,Delete,Inject,HttpException} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { MS_USER } from 'src/common/constants/user-ms.constant';
import { RpcResponse } from 'src/common/models/rpc.model';
import { CreateUserDto } from './dto/create-user.dto';
import {ApiTags,ApiOperation,ApiResponse,ApiBody,ApiParam} from '@nestjs/swagger';

@ApiTags('Usuarios') 
@Controller('user')
export class UserController {
  constructor(@Inject(MS_USER) private readonly userClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Crear Usuario' })
  @ApiResponse({ status: 201, description: 'Usuario Creado' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() newUser: CreateUserDto) {

    return this.userClient.send({ users: 'create' }, { newUser }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Param('id') id: number) {
   return this.userClient.send({ users: 'findOne' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todos los Usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados' })
  @ApiResponse({ status: 404, description: 'Usuarios no encontrados' })
  async findAll() {
   return this.userClient.send({ users: 'findAll' }, {}).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

}