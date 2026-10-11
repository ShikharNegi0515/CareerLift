import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('onboard')
  async onboard(@Req() req: any, @Body() body: any) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers can create companies');
    }
    return this.companiesService.onboardEmployer(req.user.userId, body);
  }

  @Get('my-company')
  async getMyCompany(@Req() req: any) {
    if (req.user.role !== 'employer') {
      throw new UnauthorizedException('Only employers have associated companies');
    }
    return this.companiesService.getMyCompany(req.user.userId);
  }
}
