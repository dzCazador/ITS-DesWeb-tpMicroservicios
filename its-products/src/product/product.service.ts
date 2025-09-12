import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { RpcResponse } from 'src/common/model/rpc.model';
import { handleRpcError } from 'src/common/utils'
import { CreateProductDto,UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createProduct: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProduct);
      return this.productRepository.save(product);
    } catch (error) {
      handleRpcError(error);
    }
  }

  findAll() {
    return this.productRepository.find(
      { withDeleted: true },
    );
  }

  
  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new RpcException({
          error: 'Product not found',
          statusCode: 404,
        } as RpcResponse);
      }

    return product;
    } catch (error) {
      handleRpcError(error);
    }
  }

  
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);
    } catch (err) {
      handleRpcError(err);
    }
  }

  async updateStock(id: number, quantity: number ) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (product) {
        product.stock -= quantity;
      }

      
      return await this.productRepository.save(product);
    } catch (error) {
      handleRpcError(error);
    }
  }

  remove(id: number) {
    try {
      this.productRepository.findOneOrFail({ where: { id } });
      return this.productRepository.softDelete(id);
    } catch (error) {
      handleRpcError(error);
    }
  }
}
