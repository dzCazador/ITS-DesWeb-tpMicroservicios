import { Body, Controller, Delete, Get, HttpException, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto, UpdateInvoiceDto } from '../invoice/dto';
import { AddProductDto, RemoveProductDto } from './dto';
import { MS_INVOICE, MS_PRODUCT, MS_USER } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { RpcResponse } from 'src/common/models/rpc.model';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('Cart')
@UseGuards(AuthGuard('jwt')) 
@Controller('cart')
export class CartController {
  constructor(@Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Crear Carro' })
  @ApiResponse({ status: 201, description: 'Carro Creada' })
  @ApiBody({ type: CreateInvoiceDto })
  create(@Body() newInvoice: CreateInvoiceDto) {
    return this.invoiceClient.send({cart: 'create'}, { newInvoice }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Post(":id")
  @ApiOperation({ summary: 'Agrega Producto a Carro' })
  @ApiResponse({ status: 201, description: 'Producto a Carro Agregado' })
  @ApiBody({ type: AddProductDto })
  addProduct(@Param('id') id: string, @Body() addProduct: AddProductDto) {
    return this.invoiceClient.send({cart: 'addProduct'}, { id,addProduct }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }


  @Delete(":id")
  @ApiOperation({ summary: 'Remueve Producto a Carro' })
  @ApiResponse({ status: 201, description: 'Producto a Carro Removido' })
  @ApiBody({ type: RemoveProductDto })
  removeProduct(@Param('id') id: string, @Body() removeProduct: RemoveProductDto) {
    return this.invoiceClient.send({cart: 'removeProduct'}, { id,removeProduct }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

}
