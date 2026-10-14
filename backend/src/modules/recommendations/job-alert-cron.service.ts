import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../auth/user.entity.js';
import { RecommendationsService } from './recommendations.service.js';
import { EmailService } from '../email/email.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../notifications/notification.entity.js';

@Injectable()
export class JobAlertCronService {
  private readonly logger = new Logger(JobAlertCronService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly recommendationsService: RecommendationsService,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Run every day at 09:00 AM server time (EVERY_DAY_AT_9AM)
   * Sends personalized job match digest to active job seekers
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyJobAlerts(): Promise<void> {
    this.logger.log('Starting daily job alerts digest cron job...');
    await this.processJobAlertsForSeekers();
  }

  /**
   * Process job alerts for all registered job seekers
   * Can also be called manually via admin/test endpoint
   */
  async processJobAlertsForSeekers(): Promise<{ processed: number; sent: number }> {
    const seekers = await this.userRepository.find({
      where: { role: UserRole.JOB_SEEKER },
    });

    let sentCount = 0;

    for (const seeker of seekers) {
      try {
        // Fetch top recommendations scored by match percentage
        const recommendations = await this.recommendationsService.getRecommendations(seeker.id, 5);

        // Filter top matches (score >= 70%)
        const topMatches = recommendations
          .filter((job) => job.matchScore >= 70)
          .slice(0, 5)
          .map((job) => ({
            id: job.id,
            title: job.title,
            companyName: (job.company as any)?.name || 'Hiring Company',
            location: job.location || 'Remote',
            matchScore: job.matchScore,
            matchReason: job.matchReason,
          }));

        if (topMatches.length === 0) {
          continue;
        }

        // 1. Dispatch in-app notification & real-time SSE event
        await this.notificationsService.create({
          userId: seeker.id,
          type: NotificationType.NEW_JOB_MATCH,
          title: `🎯 ${topMatches.length} new job matches`,
          message: `${topMatches[0].title} and ${topMatches.length - 1} other jobs match your profile skills.`,
          link: `/dashboard/recommendations`,
        });

        // 2. Send formatted email digest
        await this.emailService.sendJobAlertDigest(
          seeker.email,
          `${seeker.firstName} ${seeker.lastName}`.trim(),
          topMatches,
        );

        sentCount++;
      } catch (err: any) {
        this.logger.error(`Failed to send job alert to user ${seeker.id} (${seeker.email}): ${err.message}`);
      }
    }

    this.logger.log(`Completed job alerts digest: ${sentCount}/${seekers.length} seekers notified.`);
    return { processed: seekers.length, sent: sentCount };
  }
}
