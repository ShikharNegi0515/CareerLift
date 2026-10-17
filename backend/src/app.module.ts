import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './modules/auth/auth.module.js';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';

// Implemented modules
import { JobsModule } from './modules/jobs/jobs.module.js';
import { ApplicationsModule } from './modules/applications/applications.module.js';
import { SavedJobsModule } from './modules/saved-jobs/saved-jobs.module.js';
import { ResumesModule } from './modules/resumes/resumes.module.js';
import { CompaniesModule } from './modules/companies/companies.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { BlogModule } from './modules/blog/blog.module.js';
import { SupportModule } from './modules/support/support.module.js';
import { RecommendationsModule } from './modules/recommendations/recommendations.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { ConversationsModule } from './modules/conversations/conversations.module.js';

// Entities
import { User } from './modules/auth/user.entity.js';
import { JobSeekerProfile } from './modules/users/job-seeker-profile.entity.js';
import { EmployerProfile } from './modules/users/employer-profile.entity.js';
import { Company } from './modules/companies/company.entity.js';
import { JobCategory } from './modules/categories/job-category.entity.js';
import { Job } from './modules/jobs/job.entity.js';
import { Application } from './modules/applications/application.entity.js';
import { SavedJob } from './modules/saved-jobs/saved-job.entity.js';
import { Resume } from './modules/resumes/resume.entity.js';
import { Notification } from './modules/notifications/notification.entity.js';
import { BlogPost } from './modules/blog/blog-post.entity.js';
import { SupportTicket } from './modules/support/support-ticket.entity.js';
import { Conversation, Message, Interview } from './modules/conversations/conversation.entity.js';
import { RecruiterInvite } from './modules/admin/recruiter-invite.entity.js';

import { JobView } from './modules/jobs/job-view.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
          JobView,
          Application,
          SavedJob,
          Resume,
          Notification,
          BlogPost,
          SupportTicket,
          Conversation,
          Message,
          Interview,
          RecruiterInvite,
        ],
      }),
    }),
    AuthModule,
    JobsModule,
    ApplicationsModule,
    SavedJobsModule,
    ResumesModule,
    CompaniesModule,
    UsersModule,
    AdminModule,
    CategoriesModule,
    NotificationsModule,
    BlogModule,
    SupportModule,
    RecommendationsModule,
    EmailModule,
    ConversationsModule,
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
