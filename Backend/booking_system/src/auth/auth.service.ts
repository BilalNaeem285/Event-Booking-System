import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
  if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const existingUser = await this.userRepo.findOne({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new BadRequestException('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = this.userRepo.create({
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    password: hashedPassword,
    role: dto.role ?? UserRole.USER,
  });

  await this.userRepo.save(user);

  return {
    message: 'User registered successfully',
  };
  }


  async login(dto: LoginDto) {
  const user = await this.userRepo
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email: dto.email })
    .getOne();

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const token = this.jwtService.sign(payload);

  return {
    accessToken: token,
  };
}

}
