import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('job_views')
@Index(['jobId', 'viewerKey'], { unique: true })
export class JobView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @Column()
  viewerKey: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne('Job', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: any;

  @CreateDateColumn()
  createdAt: Date;
}
