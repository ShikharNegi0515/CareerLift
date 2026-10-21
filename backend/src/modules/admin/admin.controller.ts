import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Access denied. Admin or Super Admin role required.');
    }
  }

  private checkSuperAdmin(req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Access denied. Only Super Admin can perform this action.');
    }
  }

  @Get('stats')
  async getStats(@Req() req: any) {
    this.checkAdmin(req);
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(@Req() req: any) {
    this.checkAdmin(req);
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/role')
  async updateUserRole(@Req() req: any, @Param('id') id: string, @Body('role') role: string) {
    this.checkSuperAdmin(req);
    return this.adminService.updateUserRole(id, role, req.user?.id);
  }

  @Get('jobs')
  async getJobs(@Req() req: any) {
    this.checkAdmin(req);
    return this.adminService.getAllJobs();
  }

  @Put('jobs/:id/status')
  async updateJobStatus(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    this.checkAdmin(req);
    return this.adminService.updateJobStatus(id, status);
  }

  @Delete('jobs/:id')
  async deleteJob(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.deleteJob(id);
  }

  @Get('companies')
  async getCompanies(@Req() req: any) {
    this.checkAdmin(req);
    return this.adminService.getAllCompanies();
  }

  @Put('companies/:id/verify')
  async updateCompanyVerification(@Req() req: any, @Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    this.checkAdmin(req);
    return this.adminService.updateCompanyVerification(id, isVerified);
  }

  @Delete('companies/:id')
  async deleteCompany(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.deleteCompany(id);
  }

  // ─── Recruiter Invites / Outreach ──────────────────────────────────────────
  @Get('recruiter-invites')
  async getRecruiterInvites(@Req() req: any) {
    this.checkAdmin(req);
    return this.adminService.getRecruiterInvites();
  }

  @Post('recruiter-invites')
  async sendRecruiterInvite(
    @Req() req: any,
    @Body() dto: { email: string; companyName?: string; contactName?: string; customMessage?: string },
  ) {
    this.checkAdmin(req);
    if (!dto.email || !dto.email.includes('@')) {
      throw new BadRequestException('A valid recruiter email address is required.');
    }
    return this.adminService.sendRecruiterInvite(dto);
  }

  @Post('recruiter-invites/:id/resend')
  async resendRecruiterInvite(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.resendRecruiterInvite(id);
  }

  @Delete('recruiter-invites/:id')
  async deleteRecruiterInvite(@Req() req: any, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.deleteRecruiterInvite(id);
  }
}

