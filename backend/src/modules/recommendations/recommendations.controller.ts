import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RecommendationsService, ScoredJob } from './recommendations.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('recommendations')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  async getRecommendations(@Req() req: any, @Query('limit') limit?: string): Promise<ScoredJob[]> {
    const take = limit ? parseInt(limit, 10) : 20;
    return this.recommendationsService.getRecommendations(req.user.id || req.user.userId, take);
  }
}
