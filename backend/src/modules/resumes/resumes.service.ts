import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity.js';
import { User } from '../auth/user.entity.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { extractSkillsFromText, extractEmail, extractPhone } from './resume-parser.util.js';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(JobSeekerProfile)
    private profilesRepository: Repository<JobSeekerProfile>,
  ) {}

  /**
   * Save an uploaded resume file and parse its contents (PDF or text).
   * Automatically extracts skills and enriches the job seeker profile.
   */
  async processAndSaveResume(
    userId: string,
    file: { originalname: string; filename: string; path: string; size: number; buffer?: Buffer; mimetype: string },
    autoSyncSkills = true,
  ): Promise<{ resume: Resume; parsedSkills: string[]; parsedSummary?: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let parsedText = '';
    let parsedSkills: string[] = [];

    // Parse text from PDF or text/markdown
    if (file.buffer) {
      if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
        parsedText = file.buffer.toString('utf-8');
        parsedSkills = extractSkillsFromText(parsedText);
      } else {
        try {
          const parser = new (PDFParse as any)({ data: file.buffer });
          const res = await parser.getText();
          parsedText = (typeof res === 'string' ? res : res?.text) || '';
          parsedSkills = extractSkillsFromText(parsedText);
        } catch (err) {
          console.warn('PDF parsing failed:', err);
        }
      }
    }

    // Check existing count for default flag
    const existingCount = await this.resumesRepository.count({ where: { user: { id: userId } } });
    const isDefault = existingCount === 0;

    const fileUrl = `/uploads/resumes/${file.filename}`;

    const resume = this.resumesRepository.create({
      user,
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      isDefault,
      parsedSkills,
      parsedText: parsedText.slice(0, 10000), // store up to 10k chars
    });

    const savedResume = await this.resumesRepository.save(resume);

    // If autoSyncSkills is enabled, merge parsed skills into the user's JobSeekerProfile
    if (autoSyncSkills && parsedSkills.length > 0) {
      try {
        const profile = await this.profilesRepository.findOne({
          where: { user: { id: userId } } as any,
        });

        if (profile) {
          const currentSkills: string[] = Array.isArray(profile.skills) ? profile.skills : [];
          const combined = Array.from(new Set([...currentSkills, ...parsedSkills]));
          profile.skills = combined;
          await this.profilesRepository.save(profile);
        }
      } catch (profileErr) {
        console.warn('Failed to sync parsed skills with profile:', profileErr);
      }
    }

    return {
      resume: savedResume,
      parsedSkills,
      parsedSummary: parsedText ? parsedText.slice(0, 200).replace(/\s+/g, ' ').trim() : undefined,
    };
  }

  async uploadResume(userId: string, fileName: string, fileUrl: string, fileSize: number): Promise<Resume> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    await this.resumesRepository.update(
      { user: { id: userId }, isDefault: true },
      { isDefault: false },
    );

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
