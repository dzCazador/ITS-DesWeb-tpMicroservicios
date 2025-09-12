import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as cron from 'node-cron';

import { AddProductDto, CreateInvoiceDto,RemoveProductDto,UpdateInvoiceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcResponse } from 'src/common/model/rpc.model';
import { MS_PRODUCT } from 'src/common/constants';
import { sendToMicroservice } from 'src/common/utils';


@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(MS_PRODUCT) private readonly productClient: ClientProxy  
  ){
      // cada una hora se corre el proceso de limpieza de carritos
      cron.schedule('0 * * * *', async () => {
      this.logger.log('Ejecutando limpieza de carritos viejos...');
      await this.cleanOldCartItems();
    });

  }

 async cleanOldCartItems(): Promise<void> {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Buscar Carritos que tengan mas de 3 dias
      const oldItems = await this.prismaService.invoice.findMany({
        where: { createdAt: { lt: threeDaysAgo } , 
          status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          }},
      });

      if (oldItems.length > 0) {
        const ids = oldItems.map((item) => item.id);
        await this.prismaService.invoice.deleteMany({
          where: { id: { in: ids } },
        });
        this.logger.log(`Se eliminaron ${ids.length} carritos viejos.`);
      } else {
        this.logger.log('No hay carritos viejos para limpiar.');
      }
    } catch (err) {
      this.logger.error('Error limpiando carritos viejos', err);
    }
  }


  async create(createInvoice: CreateInvoiceDto) {
    //si el campo status es "carrito", controlar que el usuario ya no tenga un carrito creado
    //ingorar mayusculas o minusculas
    if (createInvoice.status && createInvoice.status.toLowerCase() === 'carrito' ) {
      const existingCart = await this.prismaService.invoice.findFirst({
        where: {
          userId: createInvoice.userId,
          status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },
        },
      });
      if (existingCart) {
        throw new RpcException({
          error: 'The user already has an active cart.',
          statusCode: 404,
        } as RpcResponse);
      }
    }
    return await this.prismaService.invoice.create({
      data: {
        ...createInvoice,
        products: JSON.parse(JSON.stringify(createInvoice.products)), 
      },
    });
  }

  findAll() {
        return this.prismaService.invoice.findMany();
  }

  findOne(id: string) {
        return this.prismaService.invoice.findUnique({ where: { id } });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
        return this.prismaService.invoice.update({ 
          where: { id }, 
          data: {
            ...updateInvoiceDto,
            products: updateInvoiceDto.products ? JSON.parse(JSON.stringify(updateInvoiceDto.products)) : undefined,
          } 
        });
  }

  findUserInvoices(userId: number) {
      return this.prismaService.invoice.findMany({ where: { userId } });
  }

  remove(id: string) {
        return this.prismaService.invoice.delete({ where: { id } });
  }

  // ************** Metodos para el carrito ****************** //
  // Agregar producto al carrito
  async addProductToCart(id: string, addProduct: AddProductDto) {
    //buscar que la factura exista y que sea un carrito
    const cart = await this.prismaService.invoice.findUnique(
      { where: { id,     
        status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },
        } 
      });
    if (!cart) {
      throw new RpcException({
        error: 'Cart not found.',
        statusCode: 404,
      } as RpcResponse);
    }

    //agregar el producto al carrito
    let productsArray: any[] = [];
    if (Array.isArray(cart.products)) {
      productsArray = cart.products;
    } else if (cart.products) {
      try {
        productsArray = JSON.parse(JSON.stringify(cart.products));
        if (!Array.isArray(productsArray)) {
          productsArray = [];
        }
      } catch {
        productsArray = [];
      }
    }
    const updatedProducts = [...productsArray, addProduct];
    const total = await this.calculateTotal(updatedProducts); // Recalcular el total del carrito
    return await this.prismaService.invoice.update({
          where: { id },
          data: { products: updatedProducts, total },
        });
  }

  // Remover producto del carrito
  async removeProductFromCart(id: string, removeProduct: RemoveProductDto) {
    //buscar que la factura exista y que sea un carrito
    return this.prismaService.invoice.findUnique(
      { where: { id,     
        status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },  
        } 
      }).then(async cart => {
        if (!cart) {
          throw new RpcException({
            error: 'Cart not found.',
            statusCode: 404,
          } as RpcResponse);
        }
        //remover el producto del carrito
        let productsArray: any[] = [];
        if (Array.isArray(cart.products)) {
          productsArray = cart.products;
        } else if (cart.products) {
          try {
            productsArray = JSON.parse(JSON.stringify(cart.products));
            if (!Array.isArray(productsArray)) {
              productsArray = [];
            }
          } catch {
            productsArray = [];
          }
        }
        const updatedProducts = productsArray.filter(p => p.id !== removeProduct.id);
        const total = await this.calculateTotal(updatedProducts); // Recalcular el total del carrito
        return await this.prismaService.invoice.update({
          where: { id },
          data: { products: updatedProducts, total },
        });
      });
  }

  async getUserCart(userId: number) {
    const cart =  await this.prismaService.invoice.findFirst(
      { where: { userId,     
        status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },
        } 
      })
    if (!cart) {
      throw new RpcException({
        error: 'Cart not found.',
        statusCode: 404,
      } as RpcResponse);
    }
    return cart;

  }

  createUserCart(userId:number){
    const newCart = {
        "userId": userId,
        "products": [],
        "total": 0,
        "status": "Carrito",
    }
    return this.create(newCart);
  }

  async finalizeUserCart(userId: number) {
    return await this.prismaService.invoice.findFirst(
      { where: { userId,     
        status: {
            equals: 'carrito',
            mode: 'insensitive', // Ignora mayúsculas y minúsculas
          },
        } 
      }).then(
        async cart => {
        if (!cart) {
          throw new RpcException({
            error: 'Cart not found.',
            statusCode: 404,
          } as RpcResponse);
        }

        // Decrementar el stock de cada producto en el carrito
        if (Array.isArray(cart.products)) {
          const productUpdates = cart.products
            .filter((product: any) => product && typeof product.id === 'number' && typeof product.quantity === 'number')
            .map((product: any) => {
              const payload = {
                id: product.id,
                quantity: product.quantity
              };
              // Llama al microservicio de productos para decrementar el stock
              return sendToMicroservice(this.productClient, { products: 'updateStock' }, payload);
          });

          await Promise.all(productUpdates);
        }

        //Finalizar Carrito
        return await this.prismaService.invoice.update({
          where: { id:cart.id },
          data: { status: "Aprobado", },
        });
      });
  }


  //crear una funcion que dada una lista de productos calcule el total como la suma de los precios por cantidad
  private async calculateTotal(products: any[]): Promise<number> {
    let total = 0;
    if (Array.isArray(products)) {
      for (const product of products) {
        if (product.price && product.quantity) {
          total += product.price * product.quantity;
        }
      }
    }
    return total;
  }

}
