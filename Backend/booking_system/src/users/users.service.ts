import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../database/entities/wallet.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getCreatorWallet(userId: string) {
    const wallet = await this.walletRepo.findOne({
      where: { creator: { id: userId } },
      relations: ['creator'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      balance: wallet.balance,
      updatedAt: wallet.updatedAt,
    };
  }
}
