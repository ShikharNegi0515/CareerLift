import { Controller, Post, Delete, Get, Param, UseGuards, Req, Body, Put, UnauthorizedException } from '@nestjs/common';
import { ResumesService } from './resumes.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  async uploadResume(@Req() req: any, @Body() body: { fileName: string; fileUrl: string; fileSize: number }) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can upload resumes');
    }
    return this.resumesService.uploadResume(req.user.userId, body.fileName, body.fileUrl, body.fileSize);
  }

  @Get('me')
  async getMyResumes(@Req() req: any) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can view their resumes');
    }
    return this.resumesService.findByUser(req.user.userId);
  }

  @Put(':id/default')
  async setDefault(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can update resumes');
    }
    return this.resumesService.setDefault(req.user.userId, id);
  }

  @Delete(':id')
  async deleteResume(@Req() req: any, @Param('id') id: string) {
     if (req.user.role !== 'job_seeker') {
       throw new UnauthorizedException('Only job seekers can delete resumes');
    }
    return this.resumesService.delete(req.user.userId, id);
  }
}
