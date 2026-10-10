import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';

// Currently implemented modules
import { JobsModule } from './modules/jobs/jobs.module.js';

// We'll import these as we build them out fully, for now just the entities are used by Auth/TypeORM
import { User } from './modules/auth/user.entity.js';
import { JobSeekerProfile } from './modules/users/job-seeker-profile.entity.js';
import { EmployerProfile } from './modules/users/employer-profile.entity.js';
import { Company } from './modules/companies/company.entity.js';
import { JobCategory } from './modules/categories/job-category.entity.js';
import { Job } from './modules/jobs/job.entity.js';
import { Application } from './modules/applications/application.entity.js';
import { SavedJob } from './modules/saved-jobs/saved-job.entity.js';
import { Resume } from './modules/resumes/resume.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'careerlift.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Dev only
      entities: [
        User,
        JobSeekerProfile,
        EmployerProfile,
        Company,
        JobCategory,
        Job,
        Application,
        SavedJob,
        Resume,
      ],
    }),
    AuthModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global guard
    },
  ],
})
export class AppModule {}
