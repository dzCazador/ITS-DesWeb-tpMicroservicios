import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities';
import { envs } from '../config/envs';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DATABASE,
      entities: [Product],
      synchronize: envs.SYNC, 
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}