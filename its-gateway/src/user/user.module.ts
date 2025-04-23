import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_USER } from 'src/common/constants/user-ms.constant';
import { envs } from 'src/config/envs';

@Module({
  controllers: [UserController],
  imports: [
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
export class UserModule {}