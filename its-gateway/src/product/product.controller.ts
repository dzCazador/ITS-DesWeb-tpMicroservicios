import { Body, Controller, Get, HttpException, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { MS_PRODUCT } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { RpcResponse } from 'src/common/models/rpc.model';
import { UpdateProductDto, CreateProductDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Productos') 
@UseGuards(AuthGuard('jwt'))
@Controller('product')
export class ProductController {
  constructor(@Inject(MS_PRODUCT) private readonly productClient: ClientProxy) {}
  

  @Post()
  @ApiOperation({ summary: 'Crear Producto' })
  @ApiResponse({ status: 201, description: 'Producto Creado' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() newProduct: CreateProductDto) {

    return this.productClient.send({ products: 'create' }, { newProduct }).pipe(
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
   return this.productClient.send({ products: 'findOne' }, id).pipe(
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
   return this.productClient.send({ products: 'findAll' }, {}).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productClient.send({ products: 'update' }, { id, updateProductDto }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

}
