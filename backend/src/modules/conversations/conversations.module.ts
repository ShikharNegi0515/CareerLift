import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message, Interview } from './conversation.entity.js';
import { Application } from '../applications/application.entity.js';
import { ConversationsService } from './conversations.service.js';
import { ConversationsController } from './conversations.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Interview, Application]),
    NotificationsModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
