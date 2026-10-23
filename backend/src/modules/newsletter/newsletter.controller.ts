import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Header,
  Query,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { NewsletterService, SubscribeDto, SendNewsletterDto } from './newsletter.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Public } from '../auth/public.decorator.js';
import {
  getJobSeekerNewsletterHtml,
  getEmployerNewsletterHtml,
  getWelcomeEmailHtml,
} from '../email/email-templates.js';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Access denied. Admin or Super Admin role required.');
    }
  }

  /**
   * Public endpoint to subscribe to the newsletter
   */
  @Public()
  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto);
  }

  /**
   * Public endpoint to unsubscribe from the newsletter
   */
  @Public()
  @Post('unsubscribe')
  async unsubscribe(@Body() body: { email?: string; token?: string }) {
    return this.newsletterService.unsubscribe(body.email, body.token);
  }

  /**
   * Admin: Get all subscribers
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/subscribers')
  async getSubscribers(@Req() req: any) {
    this.checkAdmin(req);
    return this.newsletterService.getAllSubscribers();
  }

  /**
   * Admin: Get campaign history
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/campaigns')
  async getCampaigns(@Req() req: any) {
    this.checkAdmin(req);
    return this.newsletterService.getCampaignHistory();
  }

  /**
   * Admin: Get stats
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/stats')
  async getStats(@Req() req: any) {
    this.checkAdmin(req);
    return this.newsletterService.getNewsletterStats();
  }

  /**
   * Admin: Trigger newsletter broadcast manually
   */
  @UseGuards(JwtAuthGuard)
  @Post('admin/send')
  async sendNewsletter(@Req() req: any, @Body() dto: SendNewsletterDto) {
    this.checkAdmin(req);
    return this.newsletterService.sendNewsletter(
      dto,
      `${req.user.firstName || 'Admin'} (${req.user.email})`,
      'manual',
    );
  }

  /**
   * Preview endpoints: View templates directly in browser without sending any email!
   */
  @Public()
  @Get('preview')
  @Header('Content-Type', 'text/html; charset=utf-8')
  previewEmail(
    @Query('template') template: string = 'job_seeker',
    @Res() res: Response,
  ) {
    const frontendUrl = 'http://localhost:5173';

    if (template === 'employer') {
      const html = getEmployerNewsletterHtml(
        'Hiring Team',
        frontendUrl,
        {
          activeSeekersCount: 3240,
          recentApplicationsCount: 182,
          popularSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'DevOps', 'AWS', 'System Design'],
        },
        'Top 1% Engineering Talent & Weekly Market Insights',
        'Over 140+ senior candidates joined CareerLift this week ready for direct interviews.',
        `${frontendUrl}/unsubscribe?token=preview_token`,
      );
      return res.send(html);
    }

    if (template === 'welcome') {
      const html = getWelcomeEmailHtml('Alex Johnson', 'job_seeker', frontendUrl);
      return res.send(html);
    }

    if (template === 'welcome_employer') {
      const html = getWelcomeEmailHtml('Samantha Reed', 'employer', frontendUrl);
      return res.send(html);
    }

    // Default: Job Seeker Digest
    const sampleJobs = [
      {
        title: 'Staff Full Stack Engineer (AI & Core Systems)',
        companyName: 'Anthropic Labs',
        location: 'San Francisco, CA (Remote)',
        salaryMin: 185000,
        salaryMax: 245000,
        slug: 'sde-1',
        type: 'full_time',
      },
      {
        title: 'Senior Frontend Architect',
        companyName: 'Linear Technologies',
        location: 'New York, NY (Hybrid)',
        salaryMin: 160000,
        salaryMax: 210000,
        slug: 'sde-1',
        type: 'full_time',
      },
      {
        title: 'Lead DevOps & Cloud Engineer',
        companyName: 'Scale AI',
        location: 'Austin, TX (Remote)',
        salaryMin: 170000,
        salaryMax: 220000,
        slug: 'sde-1',
        type: 'full_time',
      },
    ];

    const html = getJobSeekerNewsletterHtml(
      'Alex Johnson',
      frontendUrl,
      sampleJobs,
      '🔥 Top 1% Verified Tech Roles Handpicked For You',
      'We matched your experience with 3 high-impact engineering openings with verified compensation.',
      `${frontendUrl}/unsubscribe?token=preview_token`,
    );
    return res.send(html);
  }
}

