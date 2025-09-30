import { Body, Controller, Delete, Get, HttpException, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { MS_INVOICE, MS_PRODUCT, MS_USER } from 'src/common/constants';
import { CreateInvoiceDto,UpdateInvoiceDto } from './dto';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { User,Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/user/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { sendToMicroservice } from 'src/common/utils';

@ApiTags('Invoices') 
@UseGuards(AuthGuard('jwt'))
@Controller('invoice')
export class InvoiceController {
  constructor(
    @Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy,
    @Inject(MS_PRODUCT) private readonly productClient: ClientProxy,
    @Inject(MS_USER) private readonly userClient: ClientProxy
  ) {}


  /* Patrones de Administrador */
  @Post()
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crear Factura' })
  @ApiResponse({ status: 201, description: 'Factura Creada' })
  @ApiBody({ type: CreateInvoiceDto })
  create(@Body() newInvoice: CreateInvoiceDto) {
    return sendToMicroservice(this.invoiceClient, { invoices: 'create' }, { newInvoice });
  }

  @Get("/me")
  @ApiOperation({ summary: 'Obtener todas las Facturas del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Facturas encontradas' })
  @ApiResponse({ status: 404, description: 'Facturas no encontradas' })
  async myInvoices(@User() user: any) {
    const userId = user.id;
    return this.getInvoices('findUserInvoices', userId);
  }

  @Get()
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtener todas las Facturas' })
  @ApiResponse({ status: 200, description: 'Facturas encontradas' })
  @ApiResponse({ status: 404, description: 'Facturas no encontradas' })
  async findAll() {
    return this.getInvoices('findAll');
  }

  @Get(':id')
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard) 
  @ApiOperation({ summary: 'Obtener Factura por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async findById(@Param('id') id: string) {
    const invoice = await sendToMicroservice(this.invoiceClient, { invoices: 'findOne' }, id);

    if (!invoice) {
      throw new HttpException('Factura no encontrada', 404);
    }
    const [user, products] = await firstValueFrom(
      forkJoin([
        sendToMicroservice(this.userClient, { users: 'findOne' }, invoice.userId),
        this.getProductsWithDetails(invoice.products)
      ])
    );

    const { name, ...userWithoutSub } = user;
    invoice.userName = name;

    return invoice;
  }

  @Put(':id')
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Actualizar Factura por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Factura actualizada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiBody({ type: UpdateInvoiceDto })
  async update(@Param('id') id: string, @Body() updateInvoice: UpdateInvoiceDto) {
    return await sendToMicroservice(this.invoiceClient, { invoices: 'update' }, { id, updateInvoice });
  }

  @Delete(':id')
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Eliminar Factura por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Factura eliminada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async remove(@Param('id') id: number) {
    return await sendToMicroservice(this.invoiceClient, { invoices: 'remove' }, id);
  }

  private async getInvoices(pattern: string, userId?: number) {
    const invoices = await sendToMicroservice(this.invoiceClient, { invoices: pattern }, userId || {});
    
    if (!invoices) {
      return [];
    }

    //return Promise.all(invoices.map(async (invoice: { id: string }) => this.findById(invoice.id)));
    return invoices
  }

  private async getProductsWithDetails(products: any[]): Promise<any[]> {
    const productRequests = products.map(item =>
      sendToMicroservice(this.productClient, { products: 'findOne' }, item.id)
        .catch(() => ({ name: 'Producto no disponible', ...item }))
    );
    return await Promise.all(productRequests);
  }
}

