// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async notifyUser(user: User, message: string) {
    const notification = this.notificationRepo.create({ user, message });
    return this.notificationRepo.save(notification);
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepo.findOneBy({ id: notificationId });
    if (notification) {
      notification.read = true;
      return this.notificationRepo.save(notification);
    }
    return null;
  }
}
