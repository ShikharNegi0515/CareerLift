import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity.js';
import { Company } from '../companies/company.entity.js';

@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (u) => u.employerProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => Company, (c) => c.employerProfiles, { nullable: true, eager: true })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;
}
