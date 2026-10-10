import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity('saved_jobs')
@Unique(['user', 'job'])
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', 'savedJobs', { onDelete: 'CASCADE', eager: false })
  user: any;

  @ManyToOne('Job', 'savedJobs', { onDelete: 'CASCADE', eager: false })
  job: any;

  @CreateDateColumn()
  createdAt: Date;
}
