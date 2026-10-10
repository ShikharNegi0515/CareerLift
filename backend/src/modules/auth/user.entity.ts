import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';
import { Application } from '../applications/application.entity.js';
import { SavedJob } from '../saved-jobs/saved-job.entity.js';
import { Resume } from '../resumes/resume.entity.js';

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

  @Column({ nullable: true })
  refreshTokenHash: string;

  @OneToOne(() => JobSeekerProfile, (p) => p.user, { cascade: true, nullable: true })
  seekerProfile: JobSeekerProfile;

  @OneToOne(() => EmployerProfile, (p) => p.user, { cascade: true, nullable: true })
  employerProfile: EmployerProfile;

  @OneToMany(() => Application, (a) => a.applicant)
  applications: Application[];

  @OneToMany(() => SavedJob, (s) => s.user)
  savedJobs: SavedJob[];

  @OneToMany(() => Resume, (r) => r.user)
  resumes: Resume[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
