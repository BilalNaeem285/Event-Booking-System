import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Wallet } from '../database/entities/wallet.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    UsersModule,
],
  controllers: [UsersController], // ✅ Must include controller
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
