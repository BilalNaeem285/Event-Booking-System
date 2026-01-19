import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../database/entities/booking.entity';
import { Event } from '../database/entities/event.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event, User])],
  controllers: [],
  providers: [],
})
export class BookingsModule {}
