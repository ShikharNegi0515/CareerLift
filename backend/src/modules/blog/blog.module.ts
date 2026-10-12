import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './blog-post.entity.js';
import { BlogService } from './blog.service.js';
import { BlogController } from './blog.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
