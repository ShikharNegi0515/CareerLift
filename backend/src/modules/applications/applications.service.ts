import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';
import { Resume } from '../resumes/resume.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../notifications/notification.entity.js';
import { EmailService } from '../email/email.service.js';

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
    private emailService: EmailService,
  ) {}

  async apply(userId: string, jobId: string, coverLetter?: string, resumeId?: string): Promise<Application> {
    const job = await this.jobsRepository.findOne({ 
      where: { id: jobId },
      relations: {
        company: {
          employerProfiles: {
            user: true,
          },
        },
      },
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

    // Notify employers associated with the job's company & email candidate
    try {
      const candidateName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Candidate';
      const companyName = job.company?.name || 'Company';

      // 1. Send confirmation email to applicant
      this.emailService.sendApplicationReceivedEmail(user.email, candidateName, job.title, companyName).catch(err => {
        console.warn('Failed to send application confirmation email:', err);
      });

      // 2. Notify employers via in-app notification & email
      const employerProfiles = job.company?.employerProfiles || [];
      for (const ep of employerProfiles) {
        if (ep.user?.id) {
          await this.notificationsService.create({
            userId: ep.user.id,
            type: NotificationType.APPLICATION_RECEIVED,
            title: 'New Applicant Received',
            message: `${candidateName} just submitted an application for "${job.title}".`,
            link: `/employer/applicants`,
          });

          if (ep.user?.email) {
            const employerName = [ep.user.firstName, ep.user.lastName].filter(Boolean).join(' ') || 'Hiring Manager';
            this.emailService.sendNewApplicantEmployerEmail(ep.user.email, employerName, candidateName, job.title).catch(err => {
              console.warn('Failed to send employer email:', err);
            });
          }
        }
      }
    } catch (e) {
      console.warn('Failed to dispatch applicant notifications/emails', e);
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

    // Notify applicant of status update via notification and email
    try {
      if (application.applicant?.id) {
        await this.notificationsService.create({
          userId: application.applicant.id,
          type: NotificationType.APPLICATION_STATUS_UPDATED,
          title: `Application Status: ${status.toUpperCase()}`,
          message: `Your application for "${application.job?.title}" has been updated to "${status}".`,
          link: `/seeker/applications`,
        });

        if (application.applicant.email) {
          const candidateName = [application.applicant.firstName, application.applicant.lastName].filter(Boolean).join(' ') || 'Candidate';
          const jobTitle = application.job?.title || 'Job';
          const companyName = application.job?.company?.name || 'Company';
          this.emailService.sendApplicationStatusUpdatedEmail(application.applicant.email, candidateName, jobTitle, companyName, status).catch(err => {
            console.warn('Failed to dispatch status email to applicant:', err);
          });
        }
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

