import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategory } from './job-category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly categoryRepository: Repository<JobCategory>,
  ) {}

  async findAll(): Promise<any[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.jobs', 'job')
      .select([
        'category.id',
        'category.name',
        'category.slug',
        'category.icon',
        'category.description',
      ])
      .addSelect('COUNT(job.id)', 'jobCount')
      .groupBy('category.id')
      .orderBy('category.name', 'ASC')
      .getRawAndEntities();

    return categories.entities.map((cat, idx) => ({
      ...cat,
      jobCount: parseInt(categories.raw[idx]?.jobCount || '0', 10),
    }));
  }

  async findBySlug(slug: string): Promise<JobCategory> {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async create(data: { name: string; slug?: string; icon?: string; description?: string }): Promise<JobCategory> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existing = await this.categoryRepository.findOne({
      where: [{ name: data.name }, { slug }],
    });
    if (existing) {
      throw new ConflictException('Category with this name or slug already exists');
    }

    const category = this.categoryRepository.create({
      name: data.name,
      slug,
      icon: data.icon,
      description: data.description,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: string, data: Partial<{ name: string; slug: string; icon: string; description: string }>): Promise<JobCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
    return { success: true };
  }
}
