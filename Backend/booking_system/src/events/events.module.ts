import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';

import { Event } from '../database/entities/event.entity';
import { Booking } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Booking, User]),
    PaymentsModule,

    // ✅ REQUIRED FOR IMAGE UPLOAD
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/events',
        filename: (_req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
