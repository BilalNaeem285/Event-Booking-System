import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './database/entities/user.entity';
import { Wallet } from './database/entities/wallet.entity';
import { Booking } from './database/entities/booking.entity';
import { Event } from './database/entities/event.entity';
import { Notification } from './database/entities/notification.entity';

import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './database/entities/payment.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Event, Booking, Wallet, Payment, Notification],
      synchronize: true, // dev only
    }),
    AuthModule,
    EventsModule,
    PaymentsModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule {}
