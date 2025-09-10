import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import {envs} from '../config'
import {JWTPassport} from './auth/jwt.passport'
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, JWTPassport,PrismaService],
  imports: [JwtModule.register({
    secret: envs.secredKey,
    signOptions: { expiresIn: '24h' },
  }),
  PrismaModule
  ]  
})
export class UserModule {}
