import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginDto,UpdateUserDto} from './dto';
import { RpcException } from '@nestjs/microservices';
import { RpcResponse } from 'src/common/models/rpc.model';
import { AuthService } from './auth/auth.service';
import { PayloadInterface } from 'src/common';



@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ){}

  // Método para crear un nuevo usuario
  // Este método recibe un DTO con los datos del usuario y lo guarda en la base de datos.
  // Si el usuario ya existe (por ejemplo, si el email es único), lanza una excepción.
  async create(createUser: CreateUserDto) {
    try {
      const hashedPassword = await this.authService.hashPassword(createUser.password);
      createUser.password = hashedPassword;
      const newUser = await this.prismaService.user.create({ data: createUser });
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === 'P2002') {
        throw new RpcException({
          error: 'NO SE PERMITEN VALORES DUPLICADOS (UNIQUE KEY)',
          statusCode: 409,
        });
      }
      throw new RpcException({ error, statusCode: 500 });
    }
  }
  // Método para buscar un usuario por email
  // Este método utiliza Prisma para buscar un usuario en la base de datos por su email.  
  async findByEmail(email: string) {
   
    try {
      const user = await this.prismaService.user.findUnique({
      where: { email },
    });
      if (!user) {
        throw new RpcException({
          error: 'Usuario no encontrado',
          statusCode: 404,
        } as RpcResponse);
      }

    return {
        sub: user.id,
        email: user.email,
      } as PayloadInterface;
    } catch (error) {
      throw new RpcException({
        error: error.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }
  // Método para buscar un usuario por ID
  // Este método utiliza Prisma para buscar un usuario en la base de datos por su ID. 
  async findOne(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
        throw new RpcException({
          error: 'User not found',
          statusCode: 404,
        } as RpcResponse);
      }

    return {
        sub: user.id,
        email: user.email,
        id: user.id,
        name: user.name
      } as PayloadInterface;
    } catch (error) {
      throw new RpcException({
        error: error.message || 'Unexpected error',
        statusCode: 500,
      } as RpcResponse);
    }
  }

  // Este método devuelve todos los usuarios de la base de datos.
  // Utiliza Prisma para obtener una lista de todos los usuarios.
  findAll() {
    return this.prismaService.user.findMany({});
  }

  // Método para iniciar sesión
  // Este método recibe un DTO con las credenciales del usuario (email y password).
  // Busca al usuario por email, compara la contraseña y genera un JWT si las credenciales son correctas.
  // Si el usuario no existe o la contraseña es incorrecta, lanza una excepción.
  // El JWT se genera utilizando el AuthService.
  // El usuario se devuelve sin la contraseña.
  // Si las credenciales son correctas, devuelve un objeto con el token y el usuario.
  // Si las credenciales son incorrectas, lanza una excepción de UnauthorizedException. 
  async login(credential: LoginDto): Promise<PayloadInterface> {
    // Desestructuramos el Objeto
    const {email, password} = credential
    // Buscamos el usuario
    const user = await this.prismaService.user.findFirst({where: {email}})
    //Si no lo encuentra responde no encontrado

    //cambiar el codigo para retorne una rcpexception
    if (!user) throw new RpcException({
      error: 'Usuario no encontrado',
      statusCode: 404,
    } as RpcResponse);

    //Comparamos password si no coincide responde Password Incorrecta
    const passwordOk = await this.authService.passwordCompare(password, user.password)
    if (!passwordOk) throw new RpcException({
      error: 'Password Incorrecta',
      statusCode: 401,
    } as RpcResponse);
    return {
      sub: user.id,
      email: user.email,
    } as PayloadInterface;
  }

  // Método para registrar un nuevo usuario
  // Este método recibe un DTO con los datos del usuario, verifica si el email ya está registrado,
  // hashea la contraseña y crea un nuevo usuario en la base de datos.
  // Si el email ya está registrado, lanza una excepción BadRequestException.
  // Devuelve el usuario creado sin la contraseña.
  // Utiliza el AuthService para hashear la contraseña.
  // Si ocurre un error al crear el usuario, lanza una excepción BadRequestException.
  async register(createUserDto: CreateUserDto) {
    // Desestructuramos el Objeto
    const {email, password} = createUserDto
    // Buscamos el usuario
    const user = await this.prismaService.user.findFirst({where: {email}})
    if (user) throw new BadRequestException('El correo ya está registrado')
    // Hasheamos la contraseña
    const hashedPassword = await this.authService.hashPassword(password)
    // Creamos el usuario
    const newUser = await this.prismaService.user.create({
      data: {...createUserDto, password: hashedPassword}
    })
    // Excluimos la contraseña del usuario antes de devolverlo
    const { password: _password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }


  // Método para actualizar un usuario
  async update(id: number , updateUser: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new RpcException({
        error: 'User not found',
        statusCode: 404,
      } as RpcResponse);
    }
    if (updateUser.password) {
      updateUser.password = await this.authService.hashPassword(updateUser.password);
    }
    return this.prismaService.user.update({
      where: { id },
      data: updateUser,
    });
  }

  async remove(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      if (!user) {
        throw new RpcException({
          error: 'Usuario no encontrado',
          statusCode: 404,
        } as RpcResponse);
      }

      return this.prismaService.user.update({ where: { id }, data: { isActive: false } });
    } catch (err) {
      throw new RpcException({
        error: err.message || 'Error al eliminar el usuario',
        statusCode: 500,
      } as RpcResponse);
    }
  }
}
