import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { SubscriberRole } from './newsletter-subscriber.entity.js';

@Entity('newsletter_campaigns')
export class NewsletterCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column({
    type: 'text',
    default: SubscriberRole.ALL,
  })
  targetAudience: SubscriberRole;

  @Column({ type: 'text', nullable: true })
  customHeadline: string;

  @Column({ type: 'text', nullable: true })
  customMessage: string;

  @Column({ default: 0 })
  sentCount: number;

  @Column({ default: 0 })
  failureCount: number;

  @Column({ default: 'manual' }) // 'manual' | 'automated_cron'
  triggerType: string;

  @Column({ nullable: true })
  sentBy: string;

  @CreateDateColumn()
  sentAt: Date;
}
