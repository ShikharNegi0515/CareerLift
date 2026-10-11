import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service.js';
import { CompaniesController } from './companies.controller.js';
import { Company } from './company.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';
import { Job } from '../jobs/job.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Company, EmployerProfile, Job])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
