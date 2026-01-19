import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  payer: User; // normal user

  @ManyToOne(() => User)
  receiver: User; // creator

  @ManyToOne(() => Booking)
  booking: Booking;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;
}
