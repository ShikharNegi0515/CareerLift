import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  companyInitial: string;

  @Column()
  location: string;

  @Column()
  type: string;

  @Column()
  mode: string;

  @Column('int')
  salaryMin: number;

  @Column('int')
  salaryMax: number;

  @Column()
  experience: string;

  @Column({ default: 'Just now' })
  posted: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  skills: string[];

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
