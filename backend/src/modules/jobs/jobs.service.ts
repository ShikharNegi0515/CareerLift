import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Job, JobStatus, JobType, WorkMode, ExperienceLevel } from './job.entity.js';
import { JobView } from './job-view.entity.js';

@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(JobView)
    private jobViewsRepository: Repository<JobView>,
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

    // Only return published jobs for public search (or draft if requested explicitly)
    if (query.status) {
      qb.andWhere('job.status = :status', { status: query.status });
    }

    if (query.location) {
      qb.andWhere('LOWER(job.location) LIKE :location', { location: `%${query.location.toLowerCase().trim()}%` });
    }

    if (query.jobType) {
      qb.andWhere('job.jobType = :jobType', { jobType: query.jobType });
    }

    if (query.workMode) {
      qb.andWhere('job.workMode = :workMode', { workMode: query.workMode });
    }

    if (query.experienceLevel) {
      qb.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: query.experienceLevel });
    }

    const rawKeyword = query.keyword ? String(query.keyword).trim() : '';

    if (!rawKeyword) {
      // Default: latest jobs first, featured boosted
      qb.orderBy('job.isFeatured', 'DESC');
      qb.addOrderBy('job.createdAt', 'DESC');
      return qb.getMany();
    }

    // Stack synonym dictionary for tech search
    const STACK_MAP: Record<string, string[]> = {
      mern: ['mern', 'mongodb', 'express', 'react', 'node', 'nodejs'],
      mean: ['mean', 'mongodb', 'express', 'angular', 'node', 'nodejs'],
      lamp: ['lamp', 'linux', 'apache', 'mysql', 'php'],
      jamstack: ['jamstack', 'javascript', 'api', 'markup', 'next.js', 'react'],
      frontend: ['frontend', 'front-end', 'react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html'],
      backend: ['backend', 'back-end', 'node', 'express', 'nestjs', 'django', 'python', 'java', 'golang', 'sql'],
      fullstack: ['fullstack', 'full-stack', 'react', 'node', 'javascript', 'typescript', 'database', 'frontend', 'backend'],
      python: ['python', 'django', 'flask', 'fastapi', 'pandas'],
      java: ['java', 'spring', 'springboot', 'hibernate'],
      devops: ['devops', 'docker', 'kubernetes', 'aws', 'ci/cd', 'terraform'],
    };

    const cleanKw = rawKeyword.toLowerCase();
    const relatedTokens: string[] = [cleanKw];

    // If query matches a known stack acronym (e.g. "mern"), expand to related skills
    if (STACK_MAP[cleanKw]) {
      for (const t of STACK_MAP[cleanKw]) {
        if (!relatedTokens.includes(t)) relatedTokens.push(t);
      }
    } else {
      // Check each space-separated term
      const words = cleanKw.split(/\s+/).filter(Boolean);
      for (const w of words) {
        if (!relatedTokens.includes(w)) relatedTokens.push(w);
        if (STACK_MAP[w]) {
          for (const st of STACK_MAP[w]) {
            if (!relatedTokens.includes(st)) relatedTokens.push(st);
          }
        }
      }
    }

    // Build conditions that match primary keyword OR any related stack keywords
    const whereClauses: string[] = [];
    const params: Record<string, string> = {
      exactKeyword: `%${cleanKw}%`,
    };

    whereClauses.push('LOWER(job.title) LIKE :exactKeyword');
    whereClauses.push('LOWER(job.description) LIKE :exactKeyword');
    whereClauses.push('LOWER(CAST(job.skills AS text)) LIKE :exactKeyword');
    whereClauses.push('LOWER(company.name) LIKE :exactKeyword');

    relatedTokens.forEach((token, idx) => {
      const pName = `tok_${idx}`;
      params[pName] = `%${token}%`;
      whereClauses.push(`LOWER(job.title) LIKE :${pName}`);
      whereClauses.push(`LOWER(job.description) LIKE :${pName}`);
      whereClauses.push(`LOWER(CAST(job.skills AS text)) LIKE :${pName}`);
    });

    qb.andWhere(`(${whereClauses.join(' OR ')})`, params);

    // Tiered Classification:
    // Tier 1 (Score 10): Direct Exact Match (Title or Skills)
    // Tier 2 (Score 5):  Exact match in Description or Company
    // Tier 3 (Score 1):  Related Stack Synonym (e.g. React/Node for MERN)
    // Within each Tier, the LATEST jobs (newest createdAt) ALWAYS come first!
    const exactCondition = `(LOWER(job.title) LIKE :exactKeyword OR LOWER(CAST(job.skills AS text)) LIKE :exactKeyword)`;
    const secondaryCondition = `(LOWER(job.description) LIKE :exactKeyword OR LOWER(company.name) LIKE :exactKeyword)`;

    const tierSql = `(
      CASE 
        WHEN ${exactCondition} THEN 10
        WHEN ${secondaryCondition} THEN 5
        ELSE 1
      END
    )`;

    qb.addSelect(tierSql, 'relevance_tier');
    qb.orderBy('relevance_tier', 'DESC');
    qb.addOrderBy('job.createdAt', 'DESC');

    return qb.getMany();
  }

  async findOne(
    idOrSlug: string,
    viewer?: { userId?: string | null; ip?: string; userAgent?: string },
  ): Promise<Job | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const job = await this.jobsRepository.findOne({
      where: isUuid ? [{ id: idOrSlug }, { slug: idOrSlug }] : { slug: idOrSlug },
      relations: { company: true, category: true },
    });

    if (job) {
      if (viewer) {
        // Construct unique viewer key: userId if logged in, otherwise hashed or combined IP + UserAgent
        const ua = viewer.userAgent || '';
        const viewerKey = viewer.userId ? `user_${viewer.userId}` : `ip_${viewer.ip}_${ua.slice(0, 50)}`;
        try {
          // Check if view already exists
          const existingView = await this.jobViewsRepository.findOne({
            where: { jobId: job.id, viewerKey },
          });

          if (!existingView) {
            await this.jobViewsRepository.save(
              this.jobViewsRepository.create({
                jobId: job.id,
                viewerKey,
                userId: viewer.userId || undefined,
              }),
            );
            // Increment only for unique viewer
            await this.jobsRepository.increment({ id: job.id }, 'viewCount', 1);
            job.viewCount = (job.viewCount || 0) + 1;
          }
        } catch (err) {
          // In case of race condition / unique constraint violation, ignore
        }
      }
    }

    return job;
  }

  async findEmployerJobs(userId: string): Promise<Job[]> {
    const jobs = await this.jobsRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .innerJoin('company.employerProfiles', 'profile')
      .innerJoin('profile.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('job.createdAt', 'DESC')
      .getMany();

    if (jobs.length === 0) return [];

    const jobIds = jobs.map(j => j.id);

    // Application count per job
    const appCounts: { jobId: string; count: string }[] = await this.jobsRepository.manager
      .createQueryBuilder()
      .select('app.jobId', 'jobId')
      .addSelect('COUNT(app.id)', 'count')
      .from('applications', 'app')
      .where('app.jobId IN (:...jobIds)', { jobIds })
      .groupBy('app.jobId')
      .getRawMany();

    const appCountMap = new Map<string, number>();
    for (const c of appCounts) {
      appCountMap.set(c.jobId, parseInt(c.count, 10) || 0);
    }

    // Unique view count per job from job_views table
    const viewCounts: { jobId: string; count: string }[] = await this.jobViewsRepository
      .createQueryBuilder('jv')
      .select('jv.jobId', 'jobId')
      .addSelect('COUNT(DISTINCT jv.viewerKey)', 'count')
      .where('jv.jobId IN (:...jobIds)', { jobIds })
      .groupBy('jv.jobId')
      .getRawMany();

    const viewCountMap = new Map<string, number>();
    for (const v of viewCounts) {
      viewCountMap.set(v.jobId, parseInt(v.count, 10) || 0);
    }

    for (const job of jobs) {
      (job as any).applicationCount = appCountMap.get(job.id) || 0;
      // If we have tracked unique views, display exact unique count, otherwise fallback to column
      if (viewCountMap.has(job.id)) {
        job.viewCount = viewCountMap.get(job.id) || 0;
      }
    }

    return jobs;
  }

  async createForEmployer(userId: string, dto: Partial<Job>): Promise<Job> {
    // Fetch the company associated with the user
    const profile = await this.jobsRepository.manager.createQueryBuilder('EmployerProfile', 'profile')
      .leftJoinAndSelect('profile.company', 'company')
      .innerJoin('profile.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!profile) {
      throw new Error('Employer profile not found. Please complete your company profile at /employer/onboarding');
    }

    if (!profile.company) {
      throw new Error('You must register your company before posting jobs. Please complete company onboarding.');
    }

    let categoryObj = undefined;
    if (dto.category) {
      if (typeof dto.category === 'string') {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.category);
        const cat = await this.jobsRepository.manager.createQueryBuilder('JobCategory', 'c')
          .where(isUuid ? 'c.id = :cat OR c.name = :cat' : 'c.name = :cat OR c.slug = :cat', { cat: dto.category })
          .getOne();
        if (cat) categoryObj = cat;
      } else if (dto.category.id) {
        categoryObj = dto.category;
      }
    }

    const job = this.jobsRepository.create({
      ...dto,
      category: categoryObj || dto.category,
      slug: dto.title?.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      status: JobStatus.PUBLISHED,
      company: profile.company,
    });
    return this.jobsRepository.save(job);
  }

  async create(dto: Partial<Job>): Promise<Job> {
    const job = this.jobsRepository.create(dto);
    return this.jobsRepository.save(job);
  }

  async update(id: string, dto: Partial<Job>): Promise<Job | null> {
    let categoryObj = undefined;
    if (dto.category && typeof dto.category === 'string') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.category);
      const cat = await this.jobsRepository.manager.createQueryBuilder('JobCategory', 'c')
        .where(isUuid ? 'c.id = :cat OR c.name = :cat' : 'c.name = :cat OR c.slug = :cat', { cat: dto.category })
        .getOne();
      if (cat) categoryObj = cat;
      dto = { ...dto, category: categoryObj };
    }
    await this.jobsRepository.save({ id, ...dto });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.jobsRepository.delete(id);
  }
}

