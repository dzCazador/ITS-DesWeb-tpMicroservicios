import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { firstValueFrom } from "rxjs";
import { envs } from "src/config";
import { MS_USER } from "src/common/constants"; // Ajusta la ruta si es necesario
import { PayloadInterface } from "./dto/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(MS_USER) private readonly userClient: ClientProxy,
  ) {
    console.log('JWT_SECRET configurado:', envs.SECRET ? 'SÍ' : 'NO'); // Debug
    console.log('JWT_SECRET valor:', envs.SECRET); // Debug
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.SECRET, 
    });
  }

  async validate(payload: PayloadInterface) {
    console.log('🔍 JWT validate() llamado con payload:', payload); // Debug
    
    try {
      const userId = Number(payload.sub);
      console.log('🆔 UserId extraído:', userId); // Debug
      
      if (!userId || isNaN(userId)) {
        console.log('❌ ID de usuario inválido'); // Debug
        throw new Error('El ID del usuario no es válido');
      }

      console.log('📞 Llamando a userClient.send con userId:', userId); // Debug
      
      const user = await firstValueFrom(
        this.userClient.send('findOneUser', { id: userId }),
      );

      console.log('👤 Usuario encontrado:', user); // Debug

      if (!user) {
        console.log('❌ Usuario no encontrado en la base de datos'); // Debug
        throw new UnauthorizedException('Usuario no encontrado');
      }

      console.log('✅ Validación JWT exitosa'); // Debug
      return user;
    } catch (err) {
      console.error('💥 Error al validar el usuario:', err); // Debug
      throw new UnauthorizedException('Token inválido o usuario no válido');
    }
  }
}