import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum WorkMode {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'on_site',
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  EXECUTIVE = 'executive',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', default: JobType.FULL_TIME })
  jobType: JobType;

  @Column({ type: 'text', default: WorkMode.ONSITE })
  workMode: WorkMode;

  @Column({ type: 'text', default: ExperienceLevel.MID })
  experienceLevel: ExperienceLevel;

  @Column({ nullable: true, type: 'int' })
  salaryMin: number;

  @Column({ nullable: true, type: 'int' })
  salaryMax: number;

  @Column({ nullable: true, default: 'USD' })
  salaryCurrency: string;

  @Column({ nullable: true })
  applicationDeadline: string;

  @Column({ nullable: true })
  externalApplicationUrl: string;

  @Column({ type: 'text', default: JobStatus.DRAFT })
  status: JobStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0, type: 'int' })
  viewCount: number;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  skills: string[];

  @ManyToOne('Company', 'jobs', { nullable: true, eager: false })
  company: any;

  @ManyToOne('JobCategory', 'jobs', { nullable: true, eager: false })
  category: any;

  @OneToMany('Application', 'job')
  applications: any[];

  @OneToMany('SavedJob', 'job')
  savedJobs: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
