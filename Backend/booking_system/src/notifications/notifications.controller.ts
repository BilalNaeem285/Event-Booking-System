import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // 🔔 Get logged-in user's notifications
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.id);
  }
}
