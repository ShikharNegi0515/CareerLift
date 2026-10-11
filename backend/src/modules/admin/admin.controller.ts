import { Controller, Get, Put, Delete, Param, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin') {
      throw new UnauthorizedException('Access denied. Admin role required.');
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
    this.checkAdmin(req);
    return this.adminService.updateUserRole(id, role);
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
}
