import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';

// Currently implemented modules
import { JobsModule } from './modules/jobs/jobs.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { SavedJobsModule } from './modules/saved-jobs/saved-jobs.module.js';
import { ResumesModule } from './modules/resumes/resumes.module.js';
import { CompaniesModule } from './modules/companies/companies.module.js';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'your_password'),
        database: config.get<string>('DB_NAME', 'careerlift'),
        autoLoadEntities: true,
        synchronize: true, // Dev only - creates tables automatically
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
    }),
    AuthModule,
    JobsModule,
    ApplicationsModule,
    SavedJobsModule,
    ResumesModule,
    CompaniesModule,
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
