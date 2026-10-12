import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum NotificationType {
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_STATUS_UPDATED = 'application_status_updated',
  NEW_JOB_MATCH = 'new_job_match',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'text',
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
