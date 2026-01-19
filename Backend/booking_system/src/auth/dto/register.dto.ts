import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
  
  @Matches(/^03\d{9}$/, {
    message: 'Phone number must start with 03 and be exactly 11 digits',
  })
  phone: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPassword: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
