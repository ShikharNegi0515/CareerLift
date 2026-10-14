import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RecommendationsService, ScoredJob } from './recommendations.service.js';
import { JobAlertCronService } from './job-alert-cron.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly jobAlertCronService: JobAlertCronService,
  ) {}

  @Get()
  async getRecommendations(@Req() req: any, @Query('limit') limit?: string): Promise<ScoredJob[]> {
    const take = limit ? parseInt(limit, 10) : 20;
    return this.recommendationsService.getRecommendations(req.user.id || req.user.userId, take);
  }

  @Post('trigger-digest')
  async triggerDigest(): Promise<{ processed: number; sent: number }> {
    return this.jobAlertCronService.processJobAlertsForSeekers();
  }
}
