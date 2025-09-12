import { Body, Controller, Get, HttpException, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { MS_PRODUCT } from 'src/common/constants';
import { Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/user/auth/roles.guard';
import { UpdateProductDto, CreateProductDto } from './dto';
import { sendToMicroservice } from 'src/common/utils';

@ApiTags('Productos') 
@UseGuards(AuthGuard('jwt'))
@Controller('product')
export class ProductController {
  constructor(@Inject(MS_PRODUCT) private readonly productClient: ClientProxy) {}
  
  @Post()
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crear Producto' })
  @ApiResponse({ status: 201, description: 'Producto Creado' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() newProduct: CreateProductDto) {
    return sendToMicroservice(this.productClient, { products: 'create' }, { newProduct });
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Obtener Producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id') id: number) {
    return sendToMicroservice(this.productClient, { products: 'findOne' }, id);
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener todos los Productos' })
  @ApiResponse({ status: 200, description: 'Productos encontrados' })
  @ApiResponse({ status: 404, description: 'Productos no encontrados' })
  async findAll() {
    return sendToMicroservice(this.productClient, { products: 'findAll' }, {});
  }
  
  @Put(':id')
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Actualizar Producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return sendToMicroservice(this.productClient, { products: 'update' }, { id, updateProductDto });
  }
}
