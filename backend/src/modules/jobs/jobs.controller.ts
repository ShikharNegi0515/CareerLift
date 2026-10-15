import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { Public } from '../auth/public.decorator.js';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.jobsService.findAll(query);
  }

  @Get('employer/me')
  findEmployerJobs(@Req() req: any) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers can view their jobs');
    }
    return this.jobsService.findEmployerJobs(req.user.userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId || req.user?.id || null;
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    return this.jobsService.findOne(id, { userId, ip: String(ip), userAgent: String(userAgent) });
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers can create jobs');
    }
    return this.jobsService.createForEmployer(req.user.userId, body);
  }

  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers can update jobs');
    }
    return this.jobsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers can delete jobs');
    }
    return this.jobsService.remove(id);
  }
}
