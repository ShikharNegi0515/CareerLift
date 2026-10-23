import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import crypto from 'crypto';

import {
  NewsletterSubscriber,
  SubscriberRole,
  SubscriptionStatus,
} from './newsletter-subscriber.entity.js';
import { NewsletterCampaign } from './newsletter-campaign.entity.js';
import { User, UserRole } from '../auth/user.entity.js';
import { Job, JobStatus } from '../jobs/job.entity.js';
import { Application } from '../applications/application.entity.js';
import { EmailService } from '../email/email.service.js';

export class SubscribeDto {
  email: string;
  name?: string;
  role?: SubscriberRole;
}

export class SendNewsletterDto {
  subject?: string;
  customHeadline?: string;
  customMessage?: string;
  targetAudience?: SubscriberRole; // 'all' | 'job_seeker' | 'employer'
}

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepo: Repository<NewsletterSubscriber>,
    @InjectRepository(NewsletterCampaign)
    private readonly campaignRepo: Repository<NewsletterCampaign>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    private readonly emailService: EmailService,
  ) { }

  /**
   * Subscribe public visitor or member
   */
  async subscribe(dto: SubscribeDto): Promise<{ success: boolean; message: string; subscriber: NewsletterSubscriber }> {
    const email = dto.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Please provide a valid email address.');
    }

    let subscriber = await this.subscriberRepo.findOne({ where: { email } });

    // Check if matching registered user exists
    const user = await this.userRepo.findOne({ where: { email } });

    if (subscriber) {
      if (subscriber.status === SubscriptionStatus.SUBSCRIBED) {
        return {
          success: true,
          message: 'You are already subscribed to the CareerLift newsletter!',
          subscriber,
        };
      }
      // Re-activate previously unsubscribed user
      subscriber.status = SubscriptionStatus.SUBSCRIBED;
      if (dto.name) subscriber.name = dto.name;
      if (dto.role) subscriber.role = dto.role;
      if (user) {
        subscriber.isRegisteredUser = true;
        subscriber.userId = user.id;
        subscriber.role = user.role === UserRole.EMPLOYER ? SubscriberRole.EMPLOYER : SubscriberRole.JOB_SEEKER;
      }
      await this.subscriberRepo.save(subscriber);
      return {
        success: true,
        message: 'Welcome back! Your subscription has been re-activated.',
        subscriber,
      };
    }

    const unsubscribeToken = crypto.randomBytes(24).toString('hex');
    const role = user
      ? user.role === UserRole.EMPLOYER
        ? SubscriberRole.EMPLOYER
        : SubscriberRole.JOB_SEEKER
      : dto.role || SubscriberRole.JOB_SEEKER;

    subscriber = this.subscriberRepo.create({
      email,
      name: dto.name || (user ? `${user.firstName} ${user.lastName}`.trim() : ''),
      role,
      status: SubscriptionStatus.SUBSCRIBED,
      isRegisteredUser: !!user,
      userId: user?.id,
      unsubscribeToken,
    });

    await this.subscriberRepo.save(subscriber);

    this.logger.log(`New subscriber joined: ${email} (${role})`);
    return {
      success: true,
      message: 'Thank you for subscribing! You will receive our latest curated updates.',
      subscriber,
    };
  }

  /**
   * Unsubscribe by email or token
   */
  async unsubscribe(email?: string, token?: string): Promise<{ success: boolean; message: string }> {
    if (!email && !token) {
      throw new BadRequestException('Email or unsubscribe token is required.');
    }

    const where: any = {};
    if (token) where.unsubscribeToken = token;
    if (email) where.email = email.trim().toLowerCase();

    const subscriber = await this.subscriberRepo.findOne({ where });
    if (!subscriber) {
      // Also look up registered user to record an unsubscribed record so they stop receiving
      if (email) {
        const user = await this.userRepo.findOne({ where: { email: email.trim().toLowerCase() } });
        if (user) {
          const newSub = this.subscriberRepo.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role === UserRole.EMPLOYER ? SubscriberRole.EMPLOYER : SubscriberRole.JOB_SEEKER,
            status: SubscriptionStatus.UNSUBSCRIBED,
            isRegisteredUser: true,
            userId: user.id,
            unsubscribeToken: crypto.randomBytes(24).toString('hex'),
          });
          await this.subscriberRepo.save(newSub);
          return { success: true, message: 'You have been successfully unsubscribed.' };
        }
      }
      throw new NotFoundException('Subscription record not found.');
    }

    subscriber.status = SubscriptionStatus.UNSUBSCRIBED;
    await this.subscriberRepo.save(subscriber);

    this.logger.log(`Subscriber unsubscribed: ${subscriber.email}`);
    return {
      success: true,
      message: 'You have been unsubscribed from CareerLift newsletters.',
    };
  }

  /**
   * Get all subscribers (Admin only)
   */
  async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    return this.subscriberRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get campaign history (Admin only)
   */
  async getCampaignHistory(): Promise<NewsletterCampaign[]> {
    return this.campaignRepo.find({
      order: { sentAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Get stats for admin newsletter dashboard
   */
  async getNewsletterStats(): Promise<any> {
    const totalSubscribers = await this.subscriberRepo.count({
      where: { status: SubscriptionStatus.SUBSCRIBED },
    });
    const jobSeekerSubscribers = await this.subscriberRepo.count({
      where: { status: SubscriptionStatus.SUBSCRIBED, role: SubscriberRole.JOB_SEEKER },
    });
    const employerSubscribers = await this.subscriberRepo.count({
      where: { status: SubscriptionStatus.SUBSCRIBED, role: SubscriberRole.EMPLOYER },
    });
    const unsubscribedCount = await this.subscriberRepo.count({
      where: { status: SubscriptionStatus.UNSUBSCRIBED },
    });

    const registeredUsersCount = await this.userRepo.count();
    const registeredSeekers = await this.userRepo.count({ where: { role: UserRole.JOB_SEEKER } });
    const registeredEmployers = await this.userRepo.count({ where: { role: UserRole.EMPLOYER } });

    const totalCampaigns = await this.campaignRepo.count();

    return {
      totalSubscribers,
      jobSeekerSubscribers,
      employerSubscribers,
      unsubscribedCount,
      registeredUsersCount,
      registeredSeekers,
      registeredEmployers,
      totalCampaigns,
    };
  }

  /**
   * Synchronize registered users who aren't yet in subscribers list (opt-in by default, can unsubscribe anytime)
   */
  async syncRegisteredUsers(): Promise<{ added: number }> {
    const users = await this.userRepo.find();
    let added = 0;

    for (const u of users) {
      if (u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN) continue;

      const existing = await this.subscriberRepo.findOne({ where: { email: u.email } });
      if (!existing) {
        const sub = this.subscriberRepo.create({
          email: u.email,
          name: `${u.firstName} ${u.lastName}`.trim(),
          role: u.role === UserRole.EMPLOYER ? SubscriberRole.EMPLOYER : SubscriberRole.JOB_SEEKER,
          status: SubscriptionStatus.SUBSCRIBED,
          isRegisteredUser: true,
          userId: u.id,
          unsubscribeToken: crypto.randomBytes(24).toString('hex'),
        });
        await this.subscriberRepo.save(sub);
        added++;
      }
    }

    return { added };
  }

  /**
   * Dispatch newsletter (Manual or Cron)
   */
  async sendNewsletter(dto: SendNewsletterDto, sentBy = 'system', triggerType = 'manual'): Promise<NewsletterCampaign> {
    const targetAudience = dto.targetAudience || SubscriberRole.ALL;

    // Ensure all registered users are synced into subscriber pool
    await this.syncRegisteredUsers();

    // Fetch active published jobs for job-seeker digest
    const latestJobs = await this.jobRepo.find({
      where: { status: JobStatus.PUBLISHED },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { company: true },
    });

    const formattedJobs = latestJobs.map((j) => ({
      title: j.title,
      companyName: j.company?.name || 'Top Tech Company',
      location: j.location || 'Remote',
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      slug: j.slug,
      type: j.jobType,
    }));

    // Fetch stats for employer digest
    const activeSeekersCount = await this.userRepo.count({ where: { role: UserRole.JOB_SEEKER } });
    const recentApplicationsCount = await this.appRepo.count();
    const employerStats = {
      activeSeekersCount,
      recentApplicationsCount,
      popularSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'DevOps', 'AWS', 'System Design'],
    };

    // Find all active subscribers
    let query = this.subscriberRepo
      .createQueryBuilder('sub')
      .where('sub.status = :status', { status: SubscriptionStatus.SUBSCRIBED });

    if (targetAudience === SubscriberRole.JOB_SEEKER) {
      query = query.andWhere('sub.role = :role', { role: SubscriberRole.JOB_SEEKER });
    } else if (targetAudience === SubscriberRole.EMPLOYER) {
      query = query.andWhere('sub.role = :role', { role: SubscriberRole.EMPLOYER });
    }

    const subscribers = await query.getMany();

    let sentCount = 0;
    let failureCount = 0;

    for (const sub of subscribers) {
      try {
        if (sub.role === SubscriberRole.EMPLOYER) {
          // Employer tailored newsletter
          await this.emailService.sendEmployerNewsletter(
            sub.email,
            sub.name || 'Hiring Partner',
            employerStats,
            dto.customHeadline,
            dto.customMessage,
            sub.unsubscribeToken,
          );
        } else {
          // Job seeker tailored newsletter
          await this.emailService.sendJobSeekerNewsletter(
            sub.email,
            sub.name || 'Job Seeker',
            formattedJobs,
            dto.customHeadline,
            dto.customMessage,
            sub.unsubscribeToken,
          );
        }
        sentCount++;
      } catch (err: any) {
        this.logger.error(`Error sending newsletter to ${sub.email}: ${err.message}`);
        failureCount++;
      }
    }

    const campaign = this.campaignRepo.create({
      subject: dto.subject || (targetAudience === SubscriberRole.EMPLOYER ? 'Employer Talent & Market Report' : 'Weekly CareerLift Hot Jobs Digest'),
      targetAudience,
      customHeadline: dto.customHeadline,
      customMessage: dto.customMessage,
      sentCount,
      failureCount,
      triggerType,
      sentBy,
    });

    return await this.campaignRepo.save(campaign);
  }

  /**
   * Automated weekly newsletter cron (Runs every week)
   */
  @Cron(CronExpression.EVERY_WEEK, { name: 'weekly_newsletter_digest' })
  async handleWeeklyCron() {
    this.logger.warn(`⏰ [NEWSLETTER CRON TRIGGERED] Executing weekly newsletter dispatch at ${new Date().toLocaleTimeString()}...`);
    try {
      const result = await this.sendNewsletter(
        {
          subject: 'Weekly CareerLift Digest: Fresh Opportunities & Talent Insights',
          targetAudience: SubscriberRole.ALL,
        },
        'automated_cron',
        'automated_cron',
      );
      this.logger.log(`✅ [NEWSLETTER CRON COMPLETE] Dispatched campaign ${result.id}. Delivered: ${result.sentCount}, Failed: ${result.failureCount}`);
    } catch (err: any) {
      this.logger.error(`❌ [NEWSLETTER CRON FAILED] Dispatch error: ${err.message}`, err.stack);
    }
  }
}
