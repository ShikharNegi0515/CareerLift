import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsController } from './applications.controller.js';
import { Application } from './application.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';
import { Resume } from '../resumes/resume.entity.js';

import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Job, User, Resume]),
    NotificationsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}

