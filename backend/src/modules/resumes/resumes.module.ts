import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './resume.entity.js';
import { User } from '../auth/user.entity.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { ResumesService } from './resumes.service.js';
import { ResumesController } from './resumes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, User, JobSeekerProfile])],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
