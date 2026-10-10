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

  @Column()
  fileUrl: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne('User', 'resumes', { onDelete: 'CASCADE', eager: false })
  user: any;

  @CreateDateColumn()
  createdAt: Date;
}
