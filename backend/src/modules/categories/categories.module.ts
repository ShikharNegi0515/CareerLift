import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategory } from './job-category.entity.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
