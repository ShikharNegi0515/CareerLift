import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job } from './job.entity.js';

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
    const jobs = Array.from({ length: 24 }, (_, i) => ({
      title: ['Senior React Developer', 'Product Manager', 'UX Designer', 'Data Scientist', 'DevOps Engineer', 'Marketing Specialist', 'Backend Engineer', 'Mobile Developer'][i % 8],
      company: ['TechCorp', 'InnovateCo', 'DesignStudio', 'DataWave', 'CloudFirst', 'GrowthLabs', 'BuildIt', 'AppForge'][i % 8],
      companyInitial: ['TC', 'IC', 'DS', 'DW', 'CF', 'GL', 'BI', 'AF'][i % 8],
      location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Los Angeles, CA', 'Boston, MA', 'Remote'][i % 8],
      type: ['Full Time', 'Part Time', 'Contract', 'Internship'][i % 4],
      mode: ['Remote', 'Hybrid', 'On-site'][i % 3],
      salaryMin: 70000 + i * 5000,
      salaryMax: 100000 + i * 5000,
      experience: ['Entry', 'Mid', 'Senior', 'Executive'][i % 4],
      posted: `${i + 1} day${i > 0 ? 's' : ''} ago`,
      category: ['Technology', 'Design', 'Marketing', 'Finance'][i % 4],
      isFeatured: i < 3,
    }));
    await this.jobsRepository.save(jobs);
    console.log('Jobs seeded!');
  }

  async findAll(query: any): Promise<Job[]> {
    const qb = this.jobsRepository.createQueryBuilder('job');

    if (query.keyword) {
      qb.andWhere('(job.title LIKE :keyword OR job.company LIKE :keyword)', { keyword: `%${query.keyword}%` });
    }
    if (query.location) {
      qb.andWhere('job.location LIKE :location', { location: `%${query.location}%` });
    }
    if (query.experienceText) {
      qb.andWhere('job.experience LIKE :experience', { experience: `%${query.experienceText}%` });
    }
    if (query.category) {
      qb.andWhere('job.category LIKE :category', { category: query.category });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Job | null> {
    return this.jobsRepository.findOneBy({ id });
  }

  async create(dto: Partial<Job>): Promise<Job> {
    const job = this.jobsRepository.create({
      ...dto,
      posted: 'Just now',
      companyInitial: dto.company ? dto.company.substring(0, 2).toUpperCase() : 'JB',
    });
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
