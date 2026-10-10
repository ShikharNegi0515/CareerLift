import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { JobsModule } from './modules/jobs/jobs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'careerlift.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Dev only
    }),
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
