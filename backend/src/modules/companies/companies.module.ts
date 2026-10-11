import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service.js';
import { CompaniesController } from './companies.controller.js';
import { Company } from './company.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Company, EmployerProfile])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
