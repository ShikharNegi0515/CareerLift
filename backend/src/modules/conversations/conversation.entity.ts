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
import { Application } from '../applications/application.entity.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION
// A thread between one employer and one seeker, tied to an application.
// ─────────────────────────────────────────────────────────────────────────────

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** The application this conversation is about */
  @ManyToOne(() => Application, { onDelete: 'CASCADE', eager: false, nullable: true })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ name: 'application_id', nullable: true })
  applicationId: string;

  /** Seeker user id */
  @Column({ name: 'seeker_id' })
  seekerId: string;

  /** Employer user id */
  @Column({ name: 'employer_id' })
  employerId: string;

  /** Quick reference: the job title for display */
  @Column({ nullable: true })
  jobTitle: string;

  /** Quick reference: company name for display */
  @Column({ nullable: true })
  companyName: string;

  @OneToMany('Message', 'conversation', { cascade: true })
  messages: any[];

  @OneToMany('Interview', 'conversation', { cascade: true })
  interviews: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE
// ─────────────────────────────────────────────────────────────────────────────

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'conversation_id' })
  conversationId: string;

  /** The user who sent the message */
  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isReadBySeeker: boolean;

  @Column({ default: false })
  isReadByEmployer: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW
// A proposed interview slot attached to a conversation.
// ─────────────────────────────────────────────────────────────────────────────

export enum InterviewStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({ name: 'conversation_id' })
  conversationId: string;

  /** ISO timestamp of the proposed interview */
  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ nullable: true })
  durationMinutes: number;

  /** Google Meet / Zoom / Teams link */
  @Column({ nullable: true })
  meetingLink: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({
    type: 'text',
    default: InterviewStatus.PENDING,
  })
  status: InterviewStatus;

  /** Who proposed the interview (employer_id) */
  @Column({ name: 'proposed_by_id' })
  proposedById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
