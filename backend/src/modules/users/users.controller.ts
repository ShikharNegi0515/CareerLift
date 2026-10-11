import { Controller, Get, Put, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Seeker profile is only available for job seekers');
    }
    return this.usersService.getSeekerProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Seeker profile is only available for job seekers');
    }
    return this.usersService.updateSeekerProfile(req.user.userId, body);
  }
}
