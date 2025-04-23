import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ users: 'create' })
  create(@Payload('newUser') newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @MessagePattern({ users: 'find' })
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  /*

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
    */
}
