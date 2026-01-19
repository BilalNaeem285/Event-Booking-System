import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { EventStatus } from '../../common/enums/event-status.enum';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column('date')
  date: string;

  @Column('time')
  time: string;

  @Column()
  totalTickets: number;

  @Column()
  availableTickets: number;

  @Column()
  imageUrl: string;

  @Column('decimal')
  ticketPrice: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @ManyToOne(() => User, (user) => user.createdEvents)
  creator: User;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
