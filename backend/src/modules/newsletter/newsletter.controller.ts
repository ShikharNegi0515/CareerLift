import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { NewsletterService, SubscribeDto, SendNewsletterDto } from './newsletter.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Public } from '../auth/public.decorator.js';

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
}
