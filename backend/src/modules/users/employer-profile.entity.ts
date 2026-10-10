import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne('User', 'employerProfile', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: any;

  @Column({ nullable: true })
  title: string;

  @ManyToOne('Company', 'employerProfiles', { nullable: true, eager: false })
  company: any;

  @CreateDateColumn()
  createdAt: Date;
}
