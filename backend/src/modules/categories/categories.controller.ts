import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Public } from '../auth/public.decorator.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: any,
    @Body() body: { name: string; slug?: string; icon?: string; description?: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can create categories');
    }
    return this.categoriesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { name?: string; slug?: string; icon?: string; description?: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can update categories');
    }
    return this.categoriesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only administrators can delete categories');
    }
    return this.categoriesService.remove(id);
  }
}
