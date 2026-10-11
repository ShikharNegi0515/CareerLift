import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';
import { Company } from '../companies/company.entity.js';
import { Application } from '../applications/application.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Job)
    private jobsRepo: Repository<Job>,
    @InjectRepository(Company)
    private companiesRepo: Repository<Company>,
    @InjectRepository(Application)
    private applicationsRepo: Repository<Application>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalJobs, totalApplications, totalCompanies] = await Promise.all([
      this.usersRepo.count(),
      this.jobsRepo.count(),
      this.applicationsRepo.count(),
      this.companiesRepo.count(),
    ]);

    const activeJobs = await this.jobsRepo.count({ where: { status: 'published' as any } });

    return {
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
    };
  }

  async getAllUsers() {
    return this.usersRepo.find({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateUserRole(id: string, role: any) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    return this.usersRepo.save(user);
  }

  async getAllJobs() {
    return this.jobsRepo.find({
      relations: { company: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateJobStatus(id: string, status: any) {
    const job = await this.jobsRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    job.status = status;
    return this.jobsRepo.save(job);
  }

  async deleteJob(id: string) {
    return this.jobsRepo.delete(id);
  }
}
