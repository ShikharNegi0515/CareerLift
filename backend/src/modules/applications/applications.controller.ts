import { Controller, Post, Get, Body, Param, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ApplicationStatus } from './application.entity.js';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':jobId')
  async apply(
    @Req() req: any,
    @Param('jobId') jobId: string,
    @Body() body: { coverLetter?: string; resumeId?: string },
  ) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can apply for jobs');
    }
    return this.applicationsService.apply(req.user.userId, jobId, body.coverLetter, body.resumeId);
  }

  @Get('me')
  async getMyApplications(@Req() req: any) {
    if (req.user.role !== 'job_seeker') {
        throw new UnauthorizedException('Only job seekers can view their applications');
    }
    return this.applicationsService.findByApplicant(req.user.userId);
  }

  @Get('employer')
  async getEmployerApplications(@Req() req: any) {
    if (req.user.role !== 'employer') {
       throw new UnauthorizedException('Only employers can view applicant listings');
    }
    return this.applicationsService.findForEmployer(req.user.userId);
  }

  @Get('job/:jobId')
  async getJobApplications(@Req() req: any, @Param('jobId') jobId: string) {
    if (req.user.role !== 'employer') {
       throw new UnauthorizedException('Only employers can view job applications');
    }
    return this.applicationsService.findByJobForEmployer(jobId, req.user.userId);
  }

  @Put(':id/status')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    if (req.user.role !== 'employer') {
        throw new UnauthorizedException('Only employers can update application status');
    }
    return this.applicationsService.updateStatusForEmployer(id, body.status, req.user.userId);
  }
}
