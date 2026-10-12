import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, BlogPostStatus } from './blog-post.entity.js';

@Injectable()
export class BlogService implements OnModuleInit {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepository: Repository<BlogPost>,
  ) {}

  async onModuleInit() {
    const count = await this.blogRepository.count();
    if (count === 0) {
      await this.seedInitialPosts();
    }
  }

  private async seedInitialPosts() {
    const posts = [
      {
        title: 'Top 10 Remote Work Tools in 2026',
        slug: 'top-10-remote-work-tools-in-2026',
        excerpt: 'Discover essential collaboration, productivity, and async communication tools for top distributed engineering teams.',
        content: `Working remotely in modern tech requires the right stack. From real-time async communication to AI-assisted coding partners, distributed workflows have evolved. In this guide, we review the top tools helping engineers and managers build high-performing distributed products in 2026.`,
        category: 'Career Advice',
        tags: ['Remote Work', 'Productivity', 'Tools'],
        status: BlogPostStatus.PUBLISHED,
        authorName: 'Alex Morgan',
        views: 1420,
      },
      {
        title: 'How to Ace Your System Design Interview',
        slug: 'how-to-ace-your-system-design-interview',
        excerpt: 'A comprehensive step-by-step breakdown of scaling architecture, load balancers, caching strategies, and database sharding.',
        content: `System design interviews evaluate your ability to think through ambiguous scalability challenges. Focus on requirements, capacity estimates, core APIs, high-level architecture, and deep-diving bottlenecks like caches and message queues.`,
        category: 'Tech Interviews',
        tags: ['Interviews', 'Architecture', 'Engineering'],
        status: BlogPostStatus.PUBLISHED,
        authorName: 'Jordan Lee',
        views: 2890,
      },
    ];

    for (const p of posts) {
      const post = this.blogRepository.create(p);
      await this.blogRepository.save(post);
    }
  }

  async findAll(status?: string, tag?: string): Promise<BlogPost[]> {
    const query = this.blogRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC');

    if (status && status !== 'all') {
      query.andWhere('post.status = :status', { status });
    }

    if (tag) {
      query.andWhere('post.category = :tag OR post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    return query.getMany();
  }

  async findPublished(): Promise<BlogPost[]> {
    return this.findAll(BlogPostStatus.PUBLISHED);
  }

  async findOne(idOrSlug: string): Promise<BlogPost> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const post = await this.blogRepository.findOne({
      where: isUuid ? [{ id: idOrSlug }, { slug: idOrSlug }] : { slug: idOrSlug },
      relations: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment views
    await this.blogRepository.increment({ id: post.id }, 'views', 1);
    post.views += 1;

    return post;
  }

  async create(data: {
    title: string;
    slug?: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    category?: string;
    tags?: string[];
    status?: BlogPostStatus;
    authorName?: string;
  }): Promise<BlogPost> {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await this.blogRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('A blog post with this slug already exists');
    }

    const post = this.blogRepository.create({
      ...data,
      slug,
      status: data.status || BlogPostStatus.PUBLISHED,
    });

    return this.blogRepository.save(post);
  }

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const post = await this.blogRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    Object.assign(post, data);
    return this.blogRepository.save(post);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const post = await this.blogRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    await this.blogRepository.remove(post);
    return { success: true };
  }
}
