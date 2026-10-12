import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogService } from './blog.service.js';
import { BlogPostStatus } from './blog-post.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Public } from '../auth/public.decorator.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  async getPublished(@Query('tag') tag?: string) {
    return this.blogService.findAll(BlogPostStatus.PUBLISHED, tag);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async getAllForAdmin(@Req() req: any, @Query('status') status?: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can access all posts');
    }
    return this.blogService.findAll(status);
  }

  @Public()
  @Get(':idOrSlug')
  async getOne(@Param('idOrSlug') idOrSlug: string) {
    return this.blogService.findOne(idOrSlug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can publish blog posts');
    }
    return this.blogService.create({
      ...body,
      authorName: body.authorName || req.user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can update blog posts');
    }
    return this.blogService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can delete blog posts');
    }
    return this.blogService.remove(id);
  }
}
