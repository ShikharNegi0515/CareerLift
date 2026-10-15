import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';
import { Job, JobStatus } from '../jobs/job.entity.js';

@Injectable()
export class CompaniesService implements OnModuleInit {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(EmployerProfile)
    private employerProfileRepository: Repository<EmployerProfile>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async onModuleInit() {
    const count = await this.companiesRepository.count();
    if (count === 0) {
      await this.seedInitialCompanies();
    }
  }

  private async seedInitialCompanies() {
    const seedData: Partial<Company>[] = [
      {
        name: 'TechCorp',
        slug: 'techcorp',
        industry: 'Technology',
        location: 'San Francisco, CA',
        size: '500–1000',
        foundedYear: 2015,
        website: 'https://techcorp.com',
        description: 'TechCorp is a leading technology company specializing in cloud infrastructure and developer tools. Founded in 2015, we have grown from a small startup to a team of 800+ engineers, designers, and product specialists building tools developers love.',
        isVerified: true,
      },
      {
        name: 'InnovateCo',
        slug: 'innovateco',
        industry: 'Technology',
        location: 'New York, NY',
        size: '51–200',
        foundedYear: 2018,
        website: 'https://innovateco.com',
        description: 'InnovateCo empowers organizations worldwide with modern AI-assisted workflow automation, smart CRM platforms, and real-time enterprise collaboration tools.',
        isVerified: true,
      },
      {
        name: 'DesignStudio',
        slug: 'designstudio',
        industry: 'Design',
        location: 'Austin, TX',
        size: '1–50',
        foundedYear: 2020,
        website: 'https://designstudio.io',
        description: 'Award-winning product and brand design agency crafting delightful, human-centric user experiences for the next generation of web and mobile products.',
        isVerified: true,
      },
      {
        name: 'DataWave',
        slug: 'datawave',
        industry: 'Finance',
        location: 'Chicago, IL',
        size: '201–500',
        foundedYear: 2016,
        website: 'https://datawave.io',
        description: 'DataWave delivers next-generation real-time analytics, automated algorithmic transaction tracking, and predictive data pipelines for modern fintech.',
        isVerified: true,
      },
      {
        name: 'CloudFirst',
        slug: 'cloudfirst',
        industry: 'Technology',
        location: 'Seattle, WA',
        size: '500–1000',
        foundedYear: 2014,
        website: 'https://cloudfirst.com',
        description: 'CloudFirst builds ultra-scalable cloud native solutions, serverless backends, and Kubernetes management systems for enterprise customers.',
        isVerified: true,
      },
      {
        name: 'HealthPlus',
        slug: 'healthplus',
        industry: 'Healthcare',
        location: 'Boston, MA',
        size: '201–500',
        foundedYear: 2017,
        website: 'https://healthplus.org',
        description: 'Revolutionizing patient care management, telemedicine, and healthcare interoperability software systems across North America.',
        isVerified: true,
      },
    ];

    for (const item of seedData) {
      const entity = this.companiesRepository.create(item);
      const saved = await this.companiesRepository.save(entity);

      // Link any unassigned jobs to TechCorp
      if (saved.slug === 'techcorp') {
        const unassignedJobs = await this.jobsRepository.find({
          where: { company: null as any },
        });
        for (const job of unassignedJobs) {
          job.company = saved;
          await this.jobsRepository.save(job);
        }
      }
    }
  }

  async findAll(query: { keyword?: string; industry?: string; location?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const qb = this.companiesRepository.createQueryBuilder('company');

    if (query.keyword) {
      qb.andWhere('(LOWER(company.name) LIKE LOWER(:keyword) OR LOWER(company.description) LIKE LOWER(:keyword))', {
        keyword: `%${query.keyword}%`,
      });
    }

    if (query.industry && query.industry !== 'All') {
      qb.andWhere('LOWER(company.industry) = LOWER(:industry)', {
        industry: query.industry,
      });
    }

    if (query.location) {
      qb.andWhere('LOWER(company.location) LIKE LOWER(:location)', {
        location: `%${query.location}%`,
      });
    }

    qb.leftJoinAndSelect('company.jobs', 'job');
    qb.orderBy('company.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    const formattedItems = items.map((company) => {
      const activeJobs = (company.jobs || []).filter((j: any) => j.status === JobStatus.PUBLISHED);
      const { jobs, ...rest } = company;
      return {
        ...rest,
        jobCount: activeJobs.length,
      };
    });

    return {
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneBySlugOrId(slugOrId: string): Promise<any> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const qb = this.companiesRepository.createQueryBuilder('company');
    
    if (isUuid) {
      qb.where('company.id = :slugOrId', { slugOrId });
    } else {
      qb.where('company.slug = :slugOrId', { slugOrId });
    }

    qb.leftJoinAndSelect('company.jobs', 'job', 'job.status = :status', { status: JobStatus.PUBLISHED });

    const company = await qb.getOne();

    if (!company) {
      throw new NotFoundException(`Company not found with identifier '${slugOrId}'`);
    }

    return {
      ...company,
      jobCount: (company.jobs || []).length,
    };
  }

  async onboardEmployer(userId: string, data: Partial<Company>): Promise<Company> {
    const profile = await this.employerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: { company: true },
    });

    if (!profile) {
      throw new NotFoundException('Employer profile not found');
    }

    if (profile.company) {
      throw new BadRequestException('Employer already has a company associated');
    }

    const company = this.companiesRepository.create({
      ...data,
      slug: (data.name || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      isVerified: false, // Must be verified by admin
    });

    const savedCompany = await this.companiesRepository.save(company);
    
    profile.company = savedCompany;
    await this.employerProfileRepository.save(profile);

    return savedCompany;
  }

  async getMyCompany(userId: string): Promise<Company | null> {
    const profile = await this.employerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: { company: true },
    });

    return profile?.company || null;
  }

  async updateMyCompany(userId: string, data: Partial<Company>): Promise<Company> {
    const profile = await this.employerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: { company: true },
    });

    if (!profile) {
      throw new NotFoundException('Employer profile not found');
    }

    let company = profile.company;
    if (!company) {
      company = this.companiesRepository.create({
        ...data,
        name: data.name || 'My Company',
        slug: (data.name || 'company').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        isVerified: false,
      });
      const savedCompany = await this.companiesRepository.save(company);
      profile.company = savedCompany;
      await this.employerProfileRepository.save(profile);
      return savedCompany;
    }

    Object.assign(company, data);
    return this.companiesRepository.save(company);
  }
}
