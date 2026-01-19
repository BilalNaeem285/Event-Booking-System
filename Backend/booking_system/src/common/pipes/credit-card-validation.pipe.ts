import { PipeTransform, BadRequestException } from '@nestjs/common';

export class CreditCardPipe implements PipeTransform {
  transform(value: string) {
    const cleaned = value.replace(/\s+/g, '');

    if (!/^\d{16}$/.test(cleaned)) {
      throw new BadRequestException('Invalid credit card number');
    }

    return {
      last4: cleaned.slice(-4),
    };
  }
}
