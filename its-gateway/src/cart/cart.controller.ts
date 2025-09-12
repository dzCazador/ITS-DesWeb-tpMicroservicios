import { Body, Controller, Delete, Get, HttpException, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { sendToMicroservice } from 'src/common/utils'

import { CreateInvoiceDto } from '../invoice/dto';
import { AddProductDto, RemoveProductDto } from './dto';
import { MS_INVOICE, MS_PRODUCT, MS_USER } from 'src/common/constants';
import { Roles, User } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/user/auth/roles.guard';

@ApiTags('Cart')
@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(@Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy) {}

 /* USER CART PATTERNS */
  @Get("/me")
  @ApiOperation({ summary: 'Obtener el Carrito del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado' })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  getUserCart(@User() user: any) {
    return sendToMicroservice(this.invoiceClient, { cart: 'getUserCart' }, user.id);
  }

  @Post("/me")
  @ApiOperation({ summary: 'Crear Carro al usuario Logueado' })
  @ApiResponse({ status: 201, description: 'Carro Creado' })
  @ApiBody({})
  createUserCart(@User() user: any) {
    return sendToMicroservice(this.invoiceClient, { cart: 'createUserCart' }, user.id);
  }

  @Post("/me/finalize")
  @ApiOperation({ summary: 'Finalizar el Carrito del Usuario Logueado' })
  @ApiResponse({ status: 200, description: 'Carrito Finalizado' })
  @ApiResponse({ status: 404, description: 'Problemas al Finalizar el Carrito' })
  finelizeUserCart(@User() user: any) {
    return sendToMicroservice(this.invoiceClient, { cart: 'finelizeUserCart' }, user.id);
  }

  @Post("/me/add")
  @ApiOperation({ summary: 'Agregar Producto a Carro del Usuario Logueado' })
  @ApiResponse({ status: 201, description: 'Producto agregado del Usuario Logueado' })
  @ApiBody({ type: AddProductDto })
  addProductToUserCart(@User() user: any, @Body() addProduct: AddProductDto) {
    return sendToMicroservice(this.invoiceClient, { cart: 'addProductToUserCart' }, { userId:user.id, addProduct });
  }

  @Delete("/me/remove")
  @ApiOperation({ summary: 'Remover Producto de Carro del Usuario Logueado' })
  @ApiResponse({ status: 201, description: 'Producto removido de Carro del Usuario Logueado' })
  @ApiBody({ type: RemoveProductDto })
  removeProductFromUserCart(@User() user: any, @Body() removeProduct: RemoveProductDto) {
    return sendToMicroservice(this.invoiceClient, { cart: 'removeProductFromUserCart' }, { userId:user.id, removeProduct });
  }  

  /* ADMIN CART Patterns */
  @Post()
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)  
  @ApiOperation({ summary: 'Crear Carro' })
  @ApiResponse({ status: 201, description: 'Carro Creado' })
  @ApiBody({ type: CreateInvoiceDto })
  create(@Body() newInvoice: CreateInvoiceDto) {
    return sendToMicroservice(this.invoiceClient, { cart: 'create' }, { newInvoice });
  }

  @Post(":id")
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)  
  @ApiOperation({ summary: 'Agregar Producto a Carro' })
  @ApiResponse({ status: 201, description: 'Producto agregado al Carro' })
  @ApiBody({ type: AddProductDto })
  addProduct(@Param('id') id: string, @Body() addProduct: AddProductDto) {
    return sendToMicroservice(this.invoiceClient, { cart: 'addProduct' }, { id, addProduct });
  }

  @Delete(":id")
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)  
  @ApiOperation({ summary: 'Remover Producto de Carro' })
  @ApiResponse({ status: 201, description: 'Producto removido de Carro' })
  @ApiBody({ type: RemoveProductDto })
  removeProduct(@Param('id') id: string, @Body() removeProduct: RemoveProductDto) {
    return sendToMicroservice(this.invoiceClient, { cart: 'removeProduct' }, { id, removeProduct });
  }

 

}
