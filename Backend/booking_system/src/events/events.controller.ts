import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path/win32';
import { diskStorage } from 'multer'; // <--- Add this
// import { extname } from 'path';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }



  // ============================
  // CREATE EVENT (CREATOR)
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  createEvent(
    @Body() dto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }
    return this.eventsService.createEvent(dto, req.user.id, file.filename);
  }


  // ============================
  // LIST ALL UPCOMING EVENTS
  // ============================
  @Get()
  listEvents() {
    return this.eventsService.listEvents();
  }

  // ============================
  // CREATOR: GET ONLY MY EVENTS
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR)
  @Get('my-events')
  getMyEvents(@Request() req) {
    return this.eventsService.getMyEvents(req.user.id);
  }

  // ============================
  // CREATOR: UPDATE EVENT
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR)
  @Patch('update/:eventId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async updateEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req,
  ) {
    return this.eventsService.updateEvent(
      eventId,
      req.user.id,
      body,
      file ? `events/${file.filename}` : undefined,
    );
  }




  // ============================
  // USER: BOOK TICKET
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('book/:eventId')
  bookTicket(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body('cardNumber') cardNumber: string,
    @Request() req,
  ) {
    return this.eventsService.bookTicket(eventId, req.user.id, cardNumber);
  }

  // ============================
  // CREATOR: CANCEL (DELETE) EVENT
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR)
  @Post('cancel/:eventId')
  cancelEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Request() req,
  ) {
    return this.eventsService.cancelEvent(eventId, req.user.id);
  }

  // ============================
  // USER: CANCEL BOOKING
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('cancel-booking/:bookingId')
  cancelBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Request() req,
  ) {
    return this.eventsService.cancelBooking(bookingId, req.user.id);
  }

  // ============================
  // USER: GET MY BOOKINGS
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('my-bookings')
  getMyBookings(@Request() req) {
    return this.eventsService.getMyBookings(req.user.id);
  }
}
// function diskStorage(arg0: { destination: string; filename: (req: any, file: any, cb: any) => void; }): any {
// throw new Error('Function not implemented.');
// }

