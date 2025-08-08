import { Body, Controller, Get, HttpException, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MS_PRODUCT } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { RpcResponse } from 'src/common/models/rpc.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller()
export class ProductController {
  constructor(@Inject(MS_PRODUCT) private readonly productClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Crear Producto' })
  @ApiResponse({ status: 201, description: 'Producto Creado' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() newProduct: CreateUserDto) {

    return this.productClient.send({ produtcs: 'create' }, { newProduct }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id') id: number) {
   return this.productClient.send({ produtcs: 'findOne' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todos los Productos' })
  @ApiResponse({ status: 200, description: 'Productos encontrados' })
  @ApiResponse({ status: 404, description: 'Productos no encontrados' })
  async findAll() {
   return this.productClient.send({ produtcs: 'findAll' }, {}).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

}
