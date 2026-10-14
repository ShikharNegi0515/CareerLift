import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity.js';
import { Subject, Observable } from 'rxjs';

export interface SseNotificationEvent {
  data: {
    type: 'notification';
    notification: Notification;
  };
}

@Injectable()
export class NotificationsService {
  // Per-user SSE subjects for real-time push
  private readonly userStreams = new Map<string, Subject<SseNotificationEvent>>();

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  /** Called by SSE controller to subscribe a user to their notification stream */
  getUserStream(userId: string): Observable<SseNotificationEvent> {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<SseNotificationEvent>());
    }
    return this.userStreams.get(userId)!.asObservable();
  }

  /** Removes a user stream when they disconnect */
  removeUserStream(userId: string) {
    const subject = this.userStreams.get(userId);
    if (subject) {
      subject.complete();
      this.userStreams.delete(userId);
    }
  }

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
  }): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    const saved = await this.notificationsRepository.save(notification);

    // Push real-time event to the connected user if they have an active SSE stream
    const subject = this.userStreams.get(data.userId);
    if (subject) {
      subject.next({ data: { type: 'notification', notification: saved } });
    }

    return saved;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean }> {
    await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async delete(id: string, userId: string): Promise<{ success: boolean }> {
    await this.notificationsRepository.delete({ id, userId });
    return { success: true };
  }
}

