import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from 'src/common/models/rpc.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}


  create(createProduct: CreateProductDto) {
    console.log('Creating product:', createProduct);
    try {
      const product = this.productRepository.create(createProduct);
      return this.productRepository.save(product);
    } catch (error) {
      throw new RpcException({
        error: error.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }

  findAll() {
    return this.productRepository.find(
      { withDeleted: true },
    )
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
      throw new RpcException({
        error: error.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }

  
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);
    } catch (err) {
      throw new RpcException({
        error: err.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }

  remove(id: number) {
    const product = this.productRepository.findOne({ where: { id } });
    if (!product) {
      return null;
    }
    return this.productRepository.softDelete(id);
  }
}
