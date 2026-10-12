import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum BlogPostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  tags: string[];

  @Column({
    type: 'text',
    default: BlogPostStatus.DRAFT,
  })
  status: BlogPostStatus;

  @ManyToOne('User', { eager: true, nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: any;

  @Column({ nullable: true, name: 'author_name' })
  authorName: string;

  @Column({ default: 0, type: 'int' })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
