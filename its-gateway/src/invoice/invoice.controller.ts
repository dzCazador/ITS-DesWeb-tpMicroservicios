import { Body, Controller, Get, HttpException, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { MS_INVOICE } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { RpcResponse } from 'src/common/models/rpc.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller()
export class InvoiceController {
  constructor(@Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy) {}

  @Post()
  @ApiOperation({ summary: 'Crear Factura' })
  @ApiResponse({ status: 201, description: 'Factura Creada' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() newInvoice: CreateUserDto) {

    return this.invoiceClient.send({ invoices: 'create' }, { newInvoice }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Factura por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async findById(@Param('id') id: number) {
   return this.invoiceClient.send({ invoices: 'findOne' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todos las Facturas' })
  @ApiResponse({ status: 200, description: 'Facturas encontrados' })
  @ApiResponse({ status: 404, description: 'Facturas no encontrados' })
  async findAll() {
   return this.invoiceClient.send({ invoices: 'findAll' }, {}).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }
}
