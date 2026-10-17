import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RecruiterInviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REVOKED = 'revoked',
}

@Entity('recruiter_invites')
export class RecruiterInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactName: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  inviteToken: string;

  @Column({
    type: 'enum',
    enum: RecruiterInviteStatus,
    default: RecruiterInviteStatus.PENDING,
  })
  status: RecruiterInviteStatus;

  @Column({ type: 'text', nullable: true })
  customMessage: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
