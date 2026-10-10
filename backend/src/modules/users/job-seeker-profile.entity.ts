import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum WorkMode {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'on_site',
}

@Entity('job_seeker_profiles')
export class JobSeekerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne('User', 'seekerProfile', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: any;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  experience: object[];

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  education: object[];

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  skills: string[];

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  preferredJobTypes: JobType[];

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  preferredWorkModes: WorkMode[];

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  preferredLocations: string[];

  @CreateDateColumn()
  createdAt: Date;
}
