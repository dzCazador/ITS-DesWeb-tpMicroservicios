import { Body, Controller, Delete, Get, HttpException, Inject, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto,UpdateInvoiceDto } from './dto';
import { MS_INVOICE, MS_PRODUCT, MS_USER } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom, of } from 'rxjs';
import { RpcResponse } from 'src/common/models/rpc.model';
import { AuthGuard } from '@nestjs/passport';
import { User,Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/user/auth/roles.guard';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Invoices') 
@UseGuards(AuthGuard('jwt'))
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(MS_INVOICE) private readonly invoiceClient: ClientProxy,
              @Inject(MS_PRODUCT) private readonly productClient: ClientProxy,
              @Inject(MS_USER) private readonly userClient:ClientProxy ) {}

  
  @Post()
  @ApiOperation({ summary: 'Crear Factura' })
  @ApiResponse({ status: 201, description: 'Factura Creada' })
  @ApiBody({ type: CreateInvoiceDto })
  create(@Body() newInvoice: CreateInvoiceDto) {
    return this.invoiceClient.send({invoices: 'create'}, { newInvoice }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }

  @Get("/me")
  @ApiOperation({ summary: 'Obtener todos las Facturas del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Facturas encontrados' })
  @ApiResponse({ status: 404, description: 'Facturas no encontrados' })
  async myInvoices( @User() user: any) {
    const userId = user.id;
    // Obtener todas las facturas
    const invoicesObservable = this.invoiceClient.send({invoices: 'findUserInvoices'}, userId).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
        
      }),
    );
    //usar firstValueFrom para convertir el observable en una promesa
    const invoices = await firstValueFrom(invoicesObservable);  
    //utilizar la funcion findById para cada factura ya que la lisma completa los datos de usuario y productos
    return Promise.all(invoices.map(async (invoice) => this.findById(invoice.id)));
  }

  //TODO:Hacer otra version que devuelva la factura con los datos completos de usuario y productos
  @Get(':id')
  @ApiOperation({ summary: 'Obtener Factura por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Factura encontrada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async findById(@Param('id') id: string) {
    // Obtener la factura
    const invoiceObservable = this.invoiceClient.send({ invoices: 'findOne' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
    //usar firstValueFrom para convertir el observable en una promesa
    const invoice = await firstValueFrom(invoiceObservable);
    if (invoice) {
      // Obtener los detalles del usuario y los productos
      const userObservable = this.userClient.send({ users: 'findOne' }, invoice.userId).pipe(
        catchError((rpcError: RpcResponse) => {
          const { statusCode = 500, error } = rpcError;
          throw new HttpException(error ?? rpcError, statusCode);
        })
      );
      //usar firstValueFrom para convertir el observable en una promesa
      const user = await firstValueFrom(userObservable);
      // Obtener los detalles de cada producto en la factura
      const products = await Promise.all(invoice.products.map(async (item) => {
        // Obtener el detalle del producto
        const productObservable = this.productClient.send({ products: 'findOne' }, item.id).pipe(
          catchError(() => {
            // Emit a fallback value as an observable
            return of({ name: 'Producto no disponible', ...item });
          })
        );

        const product = await firstValueFrom(productObservable);
        return { ...item, name: product.name };

        }));
      //quitar el campo sub de user
      const { sub, ...userWithoutSub } = user;
      const { userId, ...invoicewithoutUserId } = invoice;
      // Retornar la factura con los detalles del usuario y los productos
      return { ...invoicewithoutUserId, user: userWithoutSub, products };      

    } 
    else {
      throw new HttpException('Factura no encontrada', 404);
    }
  }


  @Get()
  //@Roles(Role.ADMIN) 
  //@UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Obtener todos las Facturas' })
  @ApiResponse({ status: 200, description: 'Facturas encontrados' })
  @ApiResponse({ status: 404, description: 'Facturas no encontrados' })
  async findAll() {
    // Obtener todas las facturas
    const invoicesObservable = this.invoiceClient.send({ invoices: 'findAll' }, {}).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
    //usar firstValueFrom para convertir el observable en una promesa
    const invoices = await firstValueFrom(invoicesObservable);  
    //utilizar la funcion findById para cada factura ya que la lisma completa los datos de usuario y productos
    return Promise.all(invoices.map(async (invoice) => this.findById(invoice.id)));
  }



  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Factura por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Factura actualizada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiBody({ type: UpdateInvoiceDto })
  async update(@Param('id') id: string, @Body() updateInvoice: UpdateInvoiceDto) {
   return this.invoiceClient.send({ invoices: 'update' }, { id, updateInvoice }).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    );
  }
  /*
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Factura por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Factura eliminada' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  async remove(@Param('id') id: number) {
    return this.invoiceClient.send({ invoices: 'remove' }, id).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }
      ),
    );
  }

  */

}
