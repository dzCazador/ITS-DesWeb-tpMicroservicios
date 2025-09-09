import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { envs } from 'src/config/envs';
import { MS_USER } from '../../common/constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: envs.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
      {
        name: MS_USER,
        transport: Transport.TCP,
        options: {
          host: envs.MS_USER_HOST,
          port: envs.MS_USER_PORT, 
        },
      },
    ]),
  ],
})
export class AuthModule {}
