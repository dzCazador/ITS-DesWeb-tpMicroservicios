import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto,UpdateProductDto } from './dto';


@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ products: 'create' })
  create(@Payload('newProduct') newProduct: CreateProductDto) {
    return this.productService.create(newProduct);
  }

  @MessagePattern({ products: 'findAll' })
  findAll() {
    return this.productService.findAll();
  }

  @MessagePattern({ products: 'findByIds' })
  findByIds(@Payload() ids: number[]) {
    return this.productService.findByIds(ids);
  }

  @MessagePattern({ products: 'findOne' })
  findOne(@Payload() id: number) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ products: 'update' })
  update(@Payload() data: { id: number; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = data;
    if (typeof id !== 'number') {
      throw new Error('El campo id es obligatorio y debe ser un número');
    }
    return this.productService.update(id, updateProductDto);
  }

  @MessagePattern({ products: 'remove' })
  remove(@Payload() id: number) {
    return this.productService.remove(id);
  }

  @MessagePattern({ products: 'updateStock' })
  async updateStock(@Payload() payload: { id: number; quantity: number }) {
    const { id, quantity } = payload;
    
    await this.productService.updateStock(id, quantity);
    // Devolver una respuesta, si es necesario
    return { success: true, message: 'Stock updated' };

  }

  
}
