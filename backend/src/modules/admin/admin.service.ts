import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';
import { Company } from '../companies/company.entity.js';
import { Application } from '../applications/application.entity.js';
import { RecruiterInvite, RecruiterInviteStatus } from './recruiter-invite.entity.js';
import { EmailService } from '../email/email.service.js';
import crypto from 'crypto';

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
    @InjectRepository(RecruiterInvite)
    private recruiterInvitesRepo: Repository<RecruiterInvite>,
    private emailService: EmailService,
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

  async updateUserRole(id: string, role: any, currentUserId?: string) {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      throw new BadRequestException('The Super Admin role cannot be modified or demoted.');
    }

    if (role === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      const superAdminCount = await this.usersRepo.count({ where: { role: UserRole.SUPER_ADMIN } });
      if (superAdminCount >= 1) {
        throw new BadRequestException('There can only be one Super Admin in the system.');
      }
    }

    if (currentUserId && currentUserId === id && role !== user.role) {
      throw new BadRequestException('You cannot change your own role.');
    }

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

  async getAllCompanies() {
    return this.companiesRepo.find({
      relations: { jobs: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateCompanyVerification(id: string, isVerified: boolean) {
    const company = await this.companiesRepo.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    company.isVerified = isVerified;
    return this.companiesRepo.save(company);
  }

  async deleteCompany(id: string) {
    return this.companiesRepo.delete(id);
  }

  // ─── Recruiter Invites / Outreach ──────────────────────────────────────────
  async getRecruiterInvites() {
    const [invites, totalCount, pendingCount, acceptedCount] = await Promise.all([
      this.recruiterInvitesRepo.find({ order: { createdAt: 'DESC' } }),
      this.recruiterInvitesRepo.count(),
      this.recruiterInvitesRepo.count({ where: { status: RecruiterInviteStatus.PENDING } }),
      this.recruiterInvitesRepo.count({ where: { status: RecruiterInviteStatus.ACCEPTED } }),
    ]);

    const conversionRate = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;

    return {
      invites,
      stats: {
        total: totalCount,
        pending: pendingCount,
        accepted: acceptedCount,
        conversionRate,
      },
    };
  }

  async sendRecruiterInvite(dto: {
    email: string;
    companyName?: string;
    contactName?: string;
    customMessage?: string;
  }) {
    const cleanEmail = dto.email.trim().toLowerCase();
    const token = crypto.randomBytes(24).toString('hex');

    // Check if an invite already exists for this email
    let invite = await this.recruiterInvitesRepo.findOne({ where: { email: cleanEmail } });

    if (invite) {
      invite.companyName = dto.companyName || invite.companyName;
      invite.contactName = dto.contactName || invite.contactName;
      invite.customMessage = dto.customMessage || invite.customMessage;
      invite.inviteToken = token;
      invite.status = RecruiterInviteStatus.PENDING;
      invite.sentAt = new Date();
    } else {
      invite = this.recruiterInvitesRepo.create({
        email: cleanEmail,
        companyName: dto.companyName || null,
        contactName: dto.contactName || null,
        customMessage: dto.customMessage || null,
        inviteToken: token,
        status: RecruiterInviteStatus.PENDING,
        sentAt: new Date(),
      });
    }

    const saved = await this.recruiterInvitesRepo.save(invite);

    // Send email via EmailService
    await this.emailService.sendRecruiterInvite(
      saved.email,
      saved.contactName,
      saved.companyName,
      saved.inviteToken,
      saved.customMessage,
    );

    return saved;
  }

  async resendRecruiterInvite(id: string) {
    const invite = await this.recruiterInvitesRepo.findOne({ where: { id } });
    if (!invite) throw new NotFoundException('Invite not found');

    invite.sentAt = new Date();
    invite.status = RecruiterInviteStatus.PENDING;
    const saved = await this.recruiterInvitesRepo.save(invite);

    await this.emailService.sendRecruiterInvite(
      saved.email,
      saved.contactName,
      saved.companyName,
      saved.inviteToken,
      saved.customMessage,
    );

    return saved;
  }

  async deleteRecruiterInvite(id: string) {
    const invite = await this.recruiterInvitesRepo.findOne({ where: { id } });
    if (!invite) throw new NotFoundException('Invite not found');
    return this.recruiterInvitesRepo.delete(id);
  }

  async markInviteAccepted(token: string) {
    const invite = await this.recruiterInvitesRepo.findOne({
      where: { inviteToken: token, status: RecruiterInviteStatus.PENDING },
    });
    if (invite) {
      invite.status = RecruiterInviteStatus.ACCEPTED;
      invite.acceptedAt = new Date();
      await this.recruiterInvitesRepo.save(invite);
    }
    return invite;
  }

  async getInviteByToken(token: string) {
    return this.recruiterInvitesRepo.findOne({ where: { inviteToken: token } });
  }
}

