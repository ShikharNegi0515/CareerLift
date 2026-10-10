import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', default: UserRole.JOB_SEEKER })
  role: UserRole;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'text' })
  refreshTokenHash: string | null;

  // Relations defined lazily to avoid circular imports
  @OneToOne('JobSeekerProfile', 'user', { cascade: true, nullable: true })
  seekerProfile: any;

  @OneToOne('EmployerProfile', 'user', { cascade: true, nullable: true })
  employerProfile: any;

  @OneToMany('Application', 'applicant')
  applications: any[];

  @OneToMany('SavedJob', 'user')
  savedJobs: any[];

  @OneToMany('Resume', 'user')
  resumes: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
