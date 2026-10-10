import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Job } from '../jobs/job.entity.js';

@Entity('saved_jobs')
@Unique(['user', 'job'])
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.savedJobs, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Job, (j) => j.savedJobs, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  job: Job;

  @CreateDateColumn()
  createdAt: Date;
}
