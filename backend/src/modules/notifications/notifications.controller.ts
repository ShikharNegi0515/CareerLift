import { Controller, Get, Put, Delete, Param, Req, Res, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Response } from 'express';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * SSE endpoint — clients connect once and receive live notification pushes.
   * The JWT is sent as Authorization header via the EventSource wrapper in the frontend.
   */
  @Sse('stream')
  stream(@Req() req: any, @Res() res: Response): Observable<MessageEvent> {
    const userId = req.user?.id || req.user?.userId;
    const stream$ = this.notificationsService.getUserStream(userId);

    // Clean up when the client disconnects
    res.on('close', () => {
      this.notificationsService.removeUserStream(userId);
    });

    return stream$ as unknown as Observable<MessageEvent>;
  }

  @Get()
  async getMyNotifications(@Req() req: any) {
    return this.notificationsService.getUserNotifications(req.user.id || req.user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id || req.user.userId);
    return { unreadCount: count };
  }

  @Put(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id || req.user.userId);
  }

  @Put('read-all')
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id || req.user.userId);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.delete(id, req.user.id || req.user.userId);
  }
}
