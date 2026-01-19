import { IsString } from 'class-validator';

export class MakePaymentDto {
  @IsString()
  cardNumber: string;
}
