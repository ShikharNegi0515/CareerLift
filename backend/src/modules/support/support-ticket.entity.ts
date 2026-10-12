import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TicketStatus {
  OPEN = 'open',
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('User', { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'text', default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Column({ type: 'text', nullable: true })
  adminReply: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
