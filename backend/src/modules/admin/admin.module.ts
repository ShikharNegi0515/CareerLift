import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { User } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';
import { Company } from '../companies/company.entity.js';
import { Application } from '../applications/application.entity.js';

import { RecruiterInvite } from './recruiter-invite.entity.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Job, Company, Application, RecruiterInvite]),
    EmailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
