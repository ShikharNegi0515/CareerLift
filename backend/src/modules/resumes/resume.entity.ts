import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column({ type: 'text' })
  fileUrl: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  parsedSkills: string[];

  @Column({ type: 'text', nullable: true })
  parsedText: string;

  @ManyToOne('User', 'resumes', { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: any;

  @CreateDateColumn()
  createdAt: Date;
}
