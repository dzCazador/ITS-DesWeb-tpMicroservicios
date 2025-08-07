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

  login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto);
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
