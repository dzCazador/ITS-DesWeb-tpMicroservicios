import {Controller,Post,Get,Body,Param,Patch,Delete,Inject, UseGuards} from '@nestjs/common';
import {ApiTags,ApiOperation,ApiResponse,ApiBody,ApiParam} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';

import { MS_USER } from 'src/common/constants';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Public, Roles } from 'src/common/decorators';
import { sendToMicroservice } from 'src/common/utils';
import { Role } from 'src/common/enums';
import { RolesGuard } from './auth/roles.guard';


@ApiTags('Usuarios') 
@Controller('user')
export class UserController {
  constructor(@Inject(MS_USER) private readonly userClient: ClientProxy) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear Usuario' })
  @ApiResponse({ status: 201, description: 'Usuario Creado' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() newUser: CreateUserDto) {
    return sendToMicroservice(this.userClient, { users: 'create' }, { newUser });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Param('id') id: number) {
    return sendToMicroservice(this.userClient, { users: 'findOne' }, id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Obtener todos los Usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados' })
  @ApiResponse({ status: 404, description: 'Usuarios no encontrados' })
  async findAll() {
    return sendToMicroservice(this.userClient, { users: 'findAll' }, {});
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Actualizar Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario Actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: number,@Body() updateUser) {
    return sendToMicroservice(this.userClient, { users: 'update' }, { id, updateUser });
  }

   @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN) 
  @ApiOperation({ summary: 'Eliminar Usuario' })
  @ApiResponse({ status: 200, description: 'Usuario Eliminado' }) 
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: number) {
    return sendToMicroservice(this.userClient, { users: 'remove' }, id);
  }
}