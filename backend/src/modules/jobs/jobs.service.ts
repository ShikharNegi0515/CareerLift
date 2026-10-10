import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job, JobStatus, JobType, WorkMode, ExperienceLevel } from './job.entity.js';

@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async onModuleInit() {
    const count = await this.jobsRepository.count();
    if (count === 0) {
      await this.seedJobs();
    }
  }

  private async seedJobs() {
    // Just a minimal seed to not fail startup
    const job = this.jobsRepository.create({
      title: 'Senior React Developer',
      slug: 'senior-react-developer-1',
      description: 'A great job',
      location: 'San Francisco, CA',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR,
      salaryMin: 120000,
      salaryMax: 150000,
      status: JobStatus.PUBLISHED,
      isFeatured: true,
    });
    await this.jobsRepository.save(job);
    console.log('Jobs seeded!');
  }

  async findAll(query: any): Promise<Job[]> {
    const qb = this.jobsRepository.createQueryBuilder('job');
    
    // Add company and category relations
    qb.leftJoinAndSelect('job.company', 'company');
    qb.leftJoinAndSelect('job.category', 'category');

    if (query.keyword) {
      qb.andWhere('(job.title LIKE :keyword OR job.description LIKE :keyword)', { keyword: '%' + query.keyword + '%' });
    }
    if (query.location) {
      qb.andWhere('job.location LIKE :location', { location: '%' + query.location + '%' });
    }
    
    // The query is much more complex in real life, but keeping it simple for now
    return qb.getMany();
  }

  async findOne(id: string): Promise<Job | null> {
    return this.jobsRepository.findOneBy({ id });
  }

  async create(dto: Partial<Job>): Promise<Job> {
    const job = this.jobsRepository.create(dto);
    return this.jobsRepository.save(job);
  }

  async update(id: string, dto: Partial<Job>): Promise<Job | null> {
    await this.jobsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.jobsRepository.delete(id);
  }
}
