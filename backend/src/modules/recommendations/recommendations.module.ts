import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../jobs/job.entity.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { RecommendationsService } from './recommendations.service.js';
import { RecommendationsController } from './recommendations.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobSeekerProfile])],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
