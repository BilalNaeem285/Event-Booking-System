import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../database/entities/event.entity';
import { Booking } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventStatus } from '../common/enums/event-status.enum';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly paymentsService: PaymentsService,
  ) { }

  // ============================
  // CREATE EVENT (CREATOR)
  // ============================
  async createEvent(dto: CreateEventDto, creatorId: string, imageFilename: string) {


    const eventDateTime = new Date(`${dto.date}T${dto.time}`);

    // 2. Calculate the minimum allowed time (Current Time + 24 Hours)
    const minAllowedTime = new Date();
    minAllowedTime.setHours(minAllowedTime.getHours() + 24);

    // 3. Compare
    if (eventDateTime < minAllowedTime) {
      throw new BadRequestException(
        'Events must be scheduled at least 24 hours in advance.'
      );
    }


    const creator = await this.userRepo.findOneBy({ id: creatorId });
    if (!creator) throw new NotFoundException('Creator not found');

    const event = this.eventRepo.create({
      ...dto,
      availableTickets: dto.totalTickets,
      creator,
      imageUrl: imageFilename, // save the filename
    });

    return this.eventRepo.save(event);
  }


  // ============================
  // LIST ALL UPCOMING EVENTS
  // ============================
  async listEvents() {
    return this.eventRepo.find({
      where: { status: EventStatus.UPCOMING },
      relations: ['creator'],
    });
  }

  // ============================
  // CREATOR: GET ONLY MY EVENTS
  // ============================
  async getMyEvents(creatorId: string) {
    return this.eventRepo.find({
      where: { creator: { id: creatorId } },
      relations: ['creator'],
      order: { id: 'DESC' },
    });
  }

  // ============================
  // UPDATE EVENT (CREATOR ONLY)
  // ============================
  async updateEvent(
    eventId: number,
    creatorId: string,
    dto: any,
    imageUrl?: string,
  ) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.creator.id !== creatorId) {
      throw new ForbiddenException('You cannot update this event');
    }



    if (dto.date || dto.time) {
      const newDate = dto.date || event.date;
      const newTime = dto.time || event.time;
      const eventDateTime = new Date(`${newDate}T${newTime}`);

      const minAllowedTime = new Date();
      minAllowedTime.setHours(minAllowedTime.getHours() + 24);

      if (eventDateTime < minAllowedTime) {
        throw new BadRequestException('Updated event time must be at least 24 hours in the future.');
      }
    }



    // ✅ TEXT FIELDS
    if (dto.name !== undefined) event.name = dto.name;
    if (dto.description !== undefined) event.description = dto.description;
    if (dto.category !== undefined) event.category = dto.category;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.date !== undefined) event.date = dto.date;
    if (dto.time !== undefined) event.time = dto.time;

    // ✅ NUMBERS (convert manually)
    if (dto.ticketPrice !== undefined) {
      event.ticketPrice = Number(dto.ticketPrice);
    }

    if (dto.totalTickets !== undefined) {
      const newTotal = Number(dto.totalTickets);
      const booked = event.totalTickets - event.availableTickets;

      if (newTotal < booked) {
        throw new BadRequestException(
          'Total tickets cannot be less than booked tickets',
        );
      }

      event.totalTickets = newTotal;
      event.availableTickets = newTotal - booked;
    }

    // ✅ IMAGE
    if (imageUrl) {
      event.imageUrl = imageUrl;
    }

    return this.eventRepo.save(event);
  }





  // ============================
  // BOOK TICKET (USER)
  // ============================
  async bookTicket(
    eventId: number,
    userId: string,
    cardNumber: string,
  ) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.availableTickets < 1)
      throw new BadRequestException('No tickets available');

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const booking = this.bookingRepo.create({ event, user });
    await this.bookingRepo.save(booking);

    event.availableTickets -= 1;
    await this.eventRepo.save(event);

    await this.paymentsService.payForBooking(
      booking,
      user,
      event.creator,
      event.ticketPrice,
    );

    return booking;
  }

  // ============================
  // USER: GET MY BOOKINGS
  // ============================
  async getMyBookings(userId: string) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'],
      order: { id: 'DESC' },
    });
  }

  // ============================
  // USER: CANCEL BOOKING
  // ============================
  async cancelBooking(bookingId: number, userId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user', 'event', 'event.creator'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.user.id !== userId)
      throw new ForbiddenException('Not your booking');

    booking.cancelled = true;
    await this.bookingRepo.save(booking);

    booking.event.availableTickets += 1;
    await this.eventRepo.save(booking.event);

    await this.paymentsService.refundBooking(
      booking,
      booking.user,
      // booking.event.creator,
      booking.event.ticketPrice,
    );

    return booking;
  }

  // ============================
  // CREATOR: DELETE (CANCEL) EVENT
  // ============================
  async cancelEvent(eventId: number, creatorId: string) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['creator', 'bookings', 'bookings.user', 'bookings.event', 'bookings.event.creator'],
    });

    if (!event) throw new NotFoundException('Event not found');

    // 🔐 OWNERSHIP CHECK
    if (event.creator.id !== creatorId) {
      throw new ForbiddenException(
        'You can only delete your own events',
      );
    }

    event.status = EventStatus.CANCELLED;
    await this.eventRepo.save(event);

    for (const booking of event.bookings) {
      booking.cancelled = true;
      await this.bookingRepo.save(booking);

      await this.paymentsService.refundBooking(
        booking,
        booking.user,
        // event.creator,
        event.ticketPrice,
      );
    }

    return event;
  }
}
