import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity.js';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (u) => u.resumes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
