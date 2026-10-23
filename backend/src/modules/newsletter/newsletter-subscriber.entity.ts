import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SubscriberRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  ALL = 'all',
}

export enum SubscriptionStatus {
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
}

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'text',
    default: SubscriberRole.JOB_SEEKER,
  })
  role: SubscriberRole;

  @Column({
    type: 'text',
    default: SubscriptionStatus.SUBSCRIBED,
  })
  status: SubscriptionStatus;

  @Column({ default: false })
  isRegisteredUser: boolean;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  unsubscribeToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
