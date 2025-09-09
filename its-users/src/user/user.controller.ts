import { Body, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto,UpdateUserDto } from './dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ users: 'create' })
  create(@Payload('newUser') newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @MessagePattern({ users: 'findOne' })
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern({ users: 'findAll' })
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ users: 'login' })
  login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto);
  }


  @MessagePattern({ users: 'update' })
  update(@Payload() data: { id: number; updateUser: UpdateUserDto }) {
      const { id, updateUser } = data;
      if (typeof id !== 'number') {
        throw new Error('El campo id es obligatorio y debe ser un número');
      }
      return this.userService.update(id, updateUser);
  }


  @MessagePattern({ users: 'remove' })
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
    
}
