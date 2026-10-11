import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';
import { Resume } from '../resumes/resume.entity.js';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
  ) {}

  async apply(userId: string, jobId: string, coverLetter?: string, resumeId?: string): Promise<Application> {
    const job = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingApplication = await this.applicationsRepository.findOne({
      where: { applicant: { id: userId }, job: { id: jobId } },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = this.applicationsRepository.create({
      applicant: user,
      job,
      coverLetter,
      resumeId,
      status: ApplicationStatus.APPLIED,
    });

    return this.applicationsRepository.save(application);
  }

  async findByApplicant(userId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { applicant: { id: userId } },
      relations: ['job', 'job.company'] as any,
      order: { createdAt: 'DESC' },
    });
  }

  private async attachResumes(applications: Application[]): Promise<Application[]> {
    const resumeIds = applications.map((a) => a.resumeId).filter(Boolean) as string[];
    if (resumeIds.length > 0) {
      const resumes = await this.resumesRepository.findBy({ id: In(resumeIds) });
      const resumeMap = new Map(resumes.map((r) => [r.id, r]));
      for (const app of applications) {
        if (app.resumeId) {
          (app as any).resume = resumeMap.get(app.resumeId) || null;
        }
      }
    }
    return applications;
  }

  async findByJob(jobId: string): Promise<Application[]> {
    const applications = await this.applicationsRepository.find({
      where: { job: { id: jobId } },
      relations: ['applicant', 'applicant.seekerProfile', 'job'] as any,
      order: { createdAt: 'DESC' },
    });
    return this.attachResumes(applications);
  }

  async findForEmployer(userId: string): Promise<Application[]> {
    const applications = await this.applicationsRepository.createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .innerJoin('company.employerProfiles', 'profile')
      .innerJoin('profile.user', 'user')
      .leftJoinAndSelect('app.applicant', 'applicant')
      .leftJoinAndSelect('applicant.seekerProfile', 'seekerProfile')
      .where('user.id = :userId', { userId })
      .orderBy('app.createdAt', 'DESC')
      .getMany();

    return this.attachResumes(applications);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const application = await this.applicationsRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    application.status = status;
    return this.applicationsRepository.save(application);
  }
}
