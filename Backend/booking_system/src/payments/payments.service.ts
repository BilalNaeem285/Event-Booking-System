import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../database/entities/payment.entity';
import { Wallet } from '../database/entities/wallet.entity';
import { User } from '../database/entities/user.entity';
import { Booking } from '../database/entities/booking.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly notificationsService: NotificationsService,
  ) { }

  // ============================
  // PAY FOR BOOKING
  // ============================
  async payForBooking(
    booking: Booking,
    payer: User,
    receiver: User,
    amount: number,
  ) {
    if (!booking || !booking.event) {
      throw new BadRequestException('Invalid booking or event not loaded');
    }

    if (!payer || !receiver) {
      throw new BadRequestException('Invalid payer or receiver');
    }

    // Find or create receiver wallet
    let receiverWallet = await this.walletRepo.findOne({
      where: { creator: { id: receiver.id } },
      relations: ['creator'],
    });

    if (!receiverWallet) {
      receiverWallet = this.walletRepo.create({
        creator: receiver,
        balance: 0,
      });
    }

    // ✅ CRITICAL FIX — FORCE NUMERIC ADDITION
    receiverWallet.balance =
      Number(receiverWallet.balance ?? 0) + Number(amount);

    await this.walletRepo.save(receiverWallet);

    // Create payment record
    const payment = this.paymentRepo.create({
      booking,
      payer,
      receiver,
      amount,
      status: PaymentStatus.PAID,
    });

    await this.paymentRepo.save(payment);

    // Notifications
    await this.notificationsService.notifyUser(
      payer,
      `You booked a ticket for ${booking.event.name}`,
    );

    await this.notificationsService.notifyUser(
      receiver,
      `You received payment for ${booking.event.name}`,
    );

    return payment;
  }

  // ============================
  // REFUND BOOKING
  // ============================
  async refundBooking(
    booking: Booking,
    payer: User,
    amount: number,
  ) {
    if (!booking || !booking.event || !booking.event.creator) {
      throw new BadRequestException('Invalid booking or event not loaded');
    }

    const creator = booking.event.creator;

    // Find creator wallet
    const wallet = await this.walletRepo.findOne({
      where: { creator: { id: creator.id } },
      relations: ['creator'],
    });

    if (!wallet) {
      throw new NotFoundException('Creator wallet not found');
    }

    // Subtract amount safely
    wallet.balance = Number(wallet.balance ?? 0) - Number(amount);
    if (wallet.balance < 0) wallet.balance = 0;

    await this.walletRepo.save(wallet);

    // Update payment status
    const payment = await this.paymentRepo.findOne({
      where: {
        booking: { id: booking.id },
        receiver: { id: creator.id },
        status: PaymentStatus.PAID,
      },
    });

    if (payment) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentRepo.save(payment);
    }

    // Send notifications
    await this.notificationsService.notifyUser(
      payer,
      `Your booking for ${booking.event.name} was cancelled. Refund processed.`,
    );

    await this.notificationsService.notifyUser(
      creator,
      `Payment for ${booking.event.name} was refunded.`,
    );

    return payment;
  }

}
