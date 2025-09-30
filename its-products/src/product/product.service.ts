import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
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

  /**
   * Creates a new product in the database.
   * @param {CreateProductDto} createProduct - The product to be created.
   * @returns {Promise<Product>} A promise that resolves to the created product.
   * @throws {RpcException} If there is an unexpected error.
   */
  create(createProduct: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProduct);
      return this.productRepository.save(product);
    } catch (error) {
      handleRpcError(error);
    }
  }

  /**
   * Returns all products from the database, including deleted ones.
   * @returns {Promise<Product[]>} A promise that resolves to an array of products.
   */
  async findAll() {
    return this.productRepository.find(
      { withDeleted: true },
    );
  }

  /**
   * Returns an array of products from the database, filtered by the given IDs.
   * If no IDs are provided, returns an empty array.
   * @param {number[]} ids - The IDs of the products to retrieve.
   * @returns {Promise<Product[]>} A promise that resolves to an array of products.
   */
  async findByIds(ids: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) {
      return []; // Maneja el caso de que no se envíen IDs.
    }

    return this.productRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  
  /**
   * Returns a product from the database by its ID.
   * @param {number} id - The ID of the product to retrieve.
   * @returns {Promise<Product>} A promise that resolves to the product.
   * @throws {RpcException} If the product is not found.
   */
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

  
  /**
   * Updates a product in the database.
   * @param {number} id - The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto - The data to update the product with.
   * @returns {Promise<Product>} A promise that resolves to the updated product.
   * @throws {RpcException} If the product is not found or if there is an unexpected error.
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);
    } catch (err) {
      handleRpcError(err);
    }
  }

  /**
   * Decrements the stock of a product by a given quantity.
   * @param {number} id - The ID of the product to update.
   * @param {number} quantity - The quantity to decrement from the product's stock.
   * @returns {Promise<Product>} A promise that resolves to the updated product.
   * @throws {RpcException} If the product is not found or if there is an unexpected error.
   */
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

  /**
   * Removes a product from the database.
   * @param {number} id - The ID of the product to remove.
   * @returns {Promise<void>} A promise that resolves when the product is removed.
   * @throws {RpcException} If the product is not found or if there is an unexpected error.
   */
  remove(id: number) {
    try {
      this.productRepository.findOneOrFail({ where: { id } });
      return this.productRepository.softDelete(id);
    } catch (error) {
      handleRpcError(error);
    }
  }
}
