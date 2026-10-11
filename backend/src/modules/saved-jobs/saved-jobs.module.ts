import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedJobsService } from './saved-jobs.service.js';
import { SavedJobsController } from './saved-jobs.controller.js';
import { SavedJob } from './saved-job.entity.js';
import { Job } from '../jobs/job.entity.js';
import { User } from '../auth/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([SavedJob, Job, User])],
  controllers: [SavedJobsController],
  providers: [SavedJobsService],
  exports: [SavedJobsService],
})
export class SavedJobsModule {}
