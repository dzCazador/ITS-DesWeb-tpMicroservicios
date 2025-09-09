import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { RpcResponse } from 'src/common/models/rpc.model';
import { MS_USER } from '../../common/constants';
import { catchError } from 'rxjs';
import { PayloadInterface } from './dto/payload.interface';

@Injectable()
export class AuthService {

    // Inject the JwtService and ClientProxy for user microservice
    constructor(
        private readonly jwtService: JwtService,
        @Inject(MS_USER) private readonly userClient: ClientProxy,
    ) {}


    // Valida usuario llamando al MS y devuelve un payload listo
    async validateUser(email: string, password: string): Promise<PayloadInterface | null> {
      try {
      const { firstValueFrom } = await import('rxjs');
      const userObservable = this.userClient.send({ users: 'login' }, { email, password }).pipe(
            catchError((rpcError: RpcResponse) => {
              const { statusCode = 500, error } = rpcError;
              throw new HttpException(error ?? rpcError, statusCode);
            }),
          );
      const user = await firstValueFrom(userObservable);

      console.log('✅ Usuario recibido del microservicio users:', user);

      if (user) {
        return { sub: user.sub, email: user.email, name: user.name };
      }
      return null;
      } catch (error) {
        console.error('Error en validateUser:', error);
        return null;
      }
    }

    // Firma el payload y genera un JWT
    async signToken(payload: PayloadInterface): Promise<string> {
      return this.jwtService.signAsync(payload);
    }

    // Genera un JWT para el usuario autenticado
    async generateToken(user: PayloadInterface): Promise<{ access_token: string }> {
      const token = await this.signToken(user);
      return { access_token: token };
    }


  



}
