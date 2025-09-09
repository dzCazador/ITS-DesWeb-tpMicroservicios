import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto,UpdateProductDto } from './dto';


@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ produtcs: 'create' })
  create(@Payload('newProduct') newProduct: CreateProductDto) {
    return this.productService.create(newProduct);
  }

  @MessagePattern({ produtcs: 'findAll' })
  findAll() {
    return this.productService.findAll();
  }

  @MessagePattern({ produtcs: 'findOne' })
  findOne(@Payload() id: number) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ produtcs: 'update' })
  update(@Payload() data: { id: number; updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = data;
    if (typeof id !== 'number') {
      throw new Error('El campo id es obligatorio y debe ser un número');
    }
    return this.productService.update(id, updateProductDto);
  }

  @MessagePattern({ produtcs: 'remove' })
  remove(@Payload() id: number) {
    return this.productService.remove(id);
  }
}
