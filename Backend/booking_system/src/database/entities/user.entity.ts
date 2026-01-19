import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Wallet } from './wallet.entity';
import { Event } from './event.entity';
import { Booking } from './booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 11 })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne(() => Wallet, (wallet) => wallet.creator)
  wallet: Wallet;

  // ✅ EVENTS CREATED BY USER
  @OneToMany(() => Event, (event) => event.creator)
  createdEvents: Event[];

  // ✅ BOOKINGS MADE BY USER
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;
}
