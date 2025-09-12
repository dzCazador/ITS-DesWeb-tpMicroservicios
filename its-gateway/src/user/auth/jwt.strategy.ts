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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.SECRET, 
    });
  }

  async validate(payload: PayloadInterface) {
    
    try {
      const userId = Number(payload.sub);
      
      if (!userId || isNaN(userId)) {
        throw new Error('El ID del usuario no es válido');
      }

      const user = await firstValueFrom(
        this.userClient.send({ users: 'findOne' }, userId ),
      );


      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o usuario no válido');
    }
  }
}