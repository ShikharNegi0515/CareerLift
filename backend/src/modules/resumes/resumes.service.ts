import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity.js';
import { User } from '../auth/user.entity.js';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async uploadResume(userId: string, fileName: string, fileUrl: string, fileSize: number): Promise<Resume> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if this is the user's first resume
    const existingCount = await this.resumesRepository.count({ where: { user: { id: userId } } });
    const isDefault = existingCount === 0;

    const resume = this.resumesRepository.create({
      user,
      fileName,
      fileUrl,
      fileSize,
      isDefault,
    });

    return this.resumesRepository.save(resume);
  }

  async findByUser(userId: string): Promise<Resume[]> {
    return this.resumesRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async setDefault(userId: string, resumeId: string): Promise<void> {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId, user: { id: userId } } });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    // Unset current default
    await this.resumesRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );

    // Set new default
    resume.isDefault = true;
    await this.resumesRepository.save(resume);
  }

  async delete(userId: string, resumeId: string): Promise<void> {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId, user: { id: userId } } });
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    const wasDefault = resume.isDefault;
    await this.resumesRepository.remove(resume);

    if (wasDefault) {
      // If deleted resume was default, set the most recent remaining resume as default
      const latest = await this.resumesRepository.findOne({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
      if (latest) {
        latest.isDefault = true;
        await this.resumesRepository.save(latest);
      }
    }
  }
}
