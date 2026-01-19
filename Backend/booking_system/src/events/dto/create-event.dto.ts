import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsNumber()
  @Type(() => Number)
  totalTickets: number;

  @IsNumber()
  @Type(() => Number)
  ticketPrice: number;

  
}
