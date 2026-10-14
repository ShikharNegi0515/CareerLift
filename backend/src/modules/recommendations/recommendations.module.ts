import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../jobs/job.entity.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { User } from '../auth/user.entity.js';
import { RecommendationsService } from './recommendations.service.js';
import { JobAlertCronService } from './job-alert-cron.service.js';
import { RecommendationsController } from './recommendations.controller.js';
import { EmailModule } from '../email/email.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobSeekerProfile, User]),
    EmailModule,
    NotificationsModule,
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, JobAlertCronService],
  exports: [RecommendationsService, JobAlertCronService],
})
export class RecommendationsModule {}
