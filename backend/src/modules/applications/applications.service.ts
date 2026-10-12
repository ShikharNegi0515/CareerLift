import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';
import { Resume } from '../resumes/resume.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../notifications/notification.entity.js';

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
    private notificationsService: NotificationsService,
  ) {}

  async apply(userId: string, jobId: string, coverLetter?: string, resumeId?: string): Promise<Application> {
    const job = await this.jobsRepository.findOne({ 
      where: { id: jobId },
      relations: ['company', 'company.employerProfiles', 'company.employerProfiles.user'] as any,
    });
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

    const savedApp = await this.applicationsRepository.save(application);

    // Notify employers associated with the job's company
    try {
      const employerProfiles = job.company?.employerProfiles || [];
      for (const ep of employerProfiles) {
        if (ep.user?.id) {
          await this.notificationsService.create({
            userId: ep.user.id,
            type: NotificationType.APPLICATION_RECEIVED,
            title: 'New Applicant Received',
            message: `${[user.firstName, user.lastName].filter(Boolean).join(' ') || 'A candidate'} just submitted an application for "${job.title}".`,
            link: `/employer/applicants`,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to dispatch applicant notification', e);
    }

    return savedApp;
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

  async findByJobForEmployer(jobId: string, employerUserId: string): Promise<Application[]> {
    const job = await this.jobsRepository.createQueryBuilder('job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.employerProfiles', 'profile')
      .innerJoin('profile.user', 'user')
      .where('job.id = :jobId AND user.id = :userId', { jobId, userId: employerUserId })
      .getOne();

    if (!job) {
      throw new BadRequestException('You do not have permission to view applicants for this job');
    }

    return this.findByJob(jobId);
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

  async updateStatusForEmployer(id: string, status: ApplicationStatus, employerUserId: string): Promise<Application> {
    const application = await this.applicationsRepository.createQueryBuilder('app')
      .innerJoinAndSelect('app.job', 'job')
      .innerJoin('job.company', 'company')
      .innerJoin('company.employerProfiles', 'profile')
      .innerJoin('profile.user', 'user')
      .leftJoinAndSelect('app.applicant', 'applicant')
      .where('app.id = :id AND user.id = :userId', { id, userId: employerUserId })
      .getOne();

    if (!application) {
      throw new BadRequestException('You do not have permission to update this application or application does not exist');
    }

    application.status = status;
    const updated = await this.applicationsRepository.save(application);

    // Notify applicant of status update
    try {
      if (application.applicant?.id) {
        await this.notificationsService.create({
          userId: application.applicant.id,
          type: NotificationType.APPLICATION_STATUS_UPDATED,
          title: `Application Status: ${status.toUpperCase()}`,
          message: `Your application for "${application.job?.title}" has been updated to "${status}".`,
          link: `/seeker/applications`,
        });
      }
    } catch (e) {
      console.warn('Failed to dispatch status notification', e);
    }

    return updated;
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

