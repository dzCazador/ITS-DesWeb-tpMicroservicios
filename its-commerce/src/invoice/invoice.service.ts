import { Injectable } from '@nestjs/common';
import { AddProductDto, CreateInvoiceDto,RemoveProductDto,UpdateInvoiceDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from 'src/common/model/rpc.model';


@Injectable()
export class InvoiceService {
  constructor(
    private readonly prismaService: PrismaService    
  ){}

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
