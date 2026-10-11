import { Controller, Post, Delete, Get, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { SavedJobsService } from './saved-jobs.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobId')
  async saveJob(@Req() req: any, @Param('jobId') jobId: string) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can save jobs');
    }
    return this.savedJobsService.saveJob(req.user.userId, jobId);
  }

  @Delete(':jobId')
  async removeSavedJob(@Req() req: any, @Param('jobId') jobId: string) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can unsave jobs');
    }
    return this.savedJobsService.removeSavedJob(req.user.userId, jobId);
  }

  @Get('me')
  async getMySavedJobs(@Req() req: any) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can view saved jobs');
    }
    return this.savedJobsService.findByUser(req.user.userId);
  }
}
