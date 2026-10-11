import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { User } from '../auth/user.entity.js';
import { JobSeekerProfile } from './job-seeker-profile.entity.js';
import { EmployerProfile } from './employer-profile.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, JobSeekerProfile, EmployerProfile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
