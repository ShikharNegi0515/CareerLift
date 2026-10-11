import { Controller, Post, Put, Body, Req, UnauthorizedException, Get, Query, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { Public } from '../auth/public.decorator.js';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.companiesService.findAll(query);
  }

  @Get('my-company')
  async getMyCompany(@Req() req: any) {
    if (req.user?.role !== 'employer') {
      throw new UnauthorizedException('Only employers have associated companies');
    }
    return this.companiesService.getMyCompany(req.user.userId);
  }

  @Put('my-company')
  async updateMyCompany(@Req() req: any, @Body() body: any) {
    if (req.user?.role !== 'employer') {
      throw new UnauthorizedException('Only employers can update company details');
    }
    return this.companiesService.updateMyCompany(req.user.userId, body);
  }

  @Post('onboard')
  async onboard(@Req() req: any, @Body() body: any) {
    if (req.user?.role !== 'employer') {
      throw new UnauthorizedException('Only employers can create companies');
    }
    return this.companiesService.onboardEmployer(req.user.userId, body);
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.companiesService.findOneBySlugOrId(slug);
  }
}

