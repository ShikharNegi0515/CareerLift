import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { Job } from './job.entity.js';
import { JobView } from './job-view.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobView])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
