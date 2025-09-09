import { Controller, UseGuards, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt.guard';
import { AuthService } from './auth.service';
import { Public,User } from 'src/common/decorators';


// Controlador de autenticación
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener un token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Token JWT generado exitosamente' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }


  // Ruta protegida que requiere autenticación
  @UseGuards(JwtGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado' })
  async getProfile(@User() usuario: any) {
    return {
      mensaje: 'Usuario autenticado',
      usuario,
    };
  }

}
