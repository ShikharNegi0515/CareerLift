import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';

export enum ApplicationStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.applications, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  applicant: User;

  @ManyToOne(() => Job, (j) => j.applications, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  job: Job;

  @Column({ type: 'text', default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  resumeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
