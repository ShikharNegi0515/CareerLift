import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Job } from '../jobs/job.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true, type: 'int' })
  foundedYear: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Job, (j) => j.company)
  jobs: Job[];

  @OneToMany(() => EmployerProfile, (e) => e.company)
  employerProfiles: EmployerProfile[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
