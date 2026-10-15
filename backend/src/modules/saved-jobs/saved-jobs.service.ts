import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from './saved-job.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(SavedJob)
    private savedJobsRepository: Repository<SavedJob>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    const job = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.savedJobsRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (existing) {
      throw new BadRequestException('Job is already saved');
    }

    const savedJob = this.savedJobsRepository.create({
      user,
      job,
    });

    return this.savedJobsRepository.save(savedJob);
  }

  async removeSavedJob(userId: string, jobId: string): Promise<void> {
    const savedJob = await this.savedJobsRepository.findOne({
      where: { user: { id: userId }, job: { id: jobId } },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.savedJobsRepository.remove(savedJob);
  }

  async findByUser(userId: string): Promise<SavedJob[]> {
    return this.savedJobsRepository.find({
      where: { user: { id: userId } },
      relations: { job: { company: true } },
      order: { createdAt: 'DESC' },
    });
  }
}
