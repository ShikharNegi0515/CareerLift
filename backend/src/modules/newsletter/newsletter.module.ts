import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterSubscriber } from './newsletter-subscriber.entity.js';
import { NewsletterCampaign } from './newsletter-campaign.entity.js';
import { NewsletterService } from './newsletter.service.js';
import { NewsletterController } from './newsletter.controller.js';
import { User } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';
import { Application } from '../applications/application.entity.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsletterSubscriber,
      NewsletterCampaign,
      User,
      Job,
      Application,
    ]),
    EmailModule,
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
