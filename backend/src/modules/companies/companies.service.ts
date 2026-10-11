import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(EmployerProfile)
    private employerProfileRepository: Repository<EmployerProfile>,
  ) {}

  async onboardEmployer(userId: string, data: Partial<Company>): Promise<Company> {
    const profile = await this.employerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['company'] as any,
    });

    if (!profile) {
      throw new NotFoundException('Employer profile not found');
    }

    if (profile.company) {
      throw new BadRequestException('Employer already has a company associated');
    }

    const company = this.companiesRepository.create({
      ...data,
      slug: data.name?.toLowerCase().replace(/\\s+/g, '-') + '-' + Date.now(),
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
      relations: ['company'] as any,
    });

    return profile?.company || null;
  }

  async updateMyCompany(userId: string, data: Partial<Company>): Promise<Company> {
    const profile = await this.employerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['company'] as any,
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
