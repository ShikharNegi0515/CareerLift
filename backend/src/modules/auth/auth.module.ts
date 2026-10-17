import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { User } from './user.entity.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';
import { Company } from '../companies/company.entity.js';
import { RecruiterInvite } from '../admin/recruiter-invite.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, JobSeekerProfile, EmployerProfile, Company, RecruiterInvite]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
