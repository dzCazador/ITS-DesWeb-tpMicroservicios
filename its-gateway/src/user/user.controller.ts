import {Controller,Post,Get,Body,Param,Patch,Delete,Inject,HttpException, Put, UseGuards} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { MS_USER } from 'src/common/constants';
import { RpcResponse } from 'src/common/models/rpc.model';
import { CreateUserDto } from './dto/create-user.dto';
import {ApiTags,ApiOperation,ApiResponse,ApiBody,ApiParam} from '@nestjs/swagger';
import { Public, User } from 'src/common/decorators';
import { AuthGuard } from '@nestjs/passport';



@ApiTags('Usuarios') 
@Controller('user')
export class UserController {
  constructor(@Inject(MS_USER) private readonly userClient: ClientProxy) {}

  @Public()
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

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario Actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ type: CreateUserDto })
  update(@Param('id') id: number,@Body() updateUser) {
      return this.userClient.send({ users: 'update' }, { id, updateUser }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario Eliminado' }) 
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: number) {
    return this.userClient.send({ users: 'removeupdate' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }
}