import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from '../jobs/job.entity.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';

export interface ScoredJob extends Job {
  matchScore: number;
  matchReason: string;
}

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
    @InjectRepository(JobSeekerProfile)
    private readonly profileRepository: Repository<JobSeekerProfile>,
  ) {}

  async getRecommendations(userId: string, limit = 20): Promise<ScoredJob[]> {
    // Load seeker profile for skill/preference matching
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } } as any,
    });

    const userSkills: string[] = profile?.skills
      ? (Array.isArray(profile.skills)
        ? profile.skills
        : (profile.skills as string).split(','))
          .map((s: string) => s.toLowerCase().trim())
          .filter(Boolean)
      : [];

    const preferredTypes: string[] = profile?.preferredJobTypes
      ? (Array.isArray(profile.preferredJobTypes)
        ? profile.preferredJobTypes
        : (profile.preferredJobTypes as string).split(','))
      : [];

    const preferredModes: string[] = profile?.preferredWorkModes
      ? (Array.isArray(profile.preferredWorkModes)
        ? profile.preferredWorkModes
        : (profile.preferredWorkModes as string).split(','))
      : [];

    const preferredLocation: string = (profile as any)?.location || '';

    // Fetch all published jobs with company and category
    const jobs = await this.jobsRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .where('job.status = :status', { status: JobStatus.PUBLISHED })
      .orderBy('job.createdAt', 'DESC')
      .take(200)
      .getMany();

    // Score each job
    const scored: ScoredJob[] = jobs.map((job) => {
      let score = 65;
      const reasons: string[] = [];

      // Skill matching
      const jobText = `${job.title} ${job.description || ''} ${Array.isArray(job.skills) ? job.skills.join(' ') : (job.skills || '')}`.toLowerCase();
      const matchedSkills = userSkills.filter((s) => jobText.includes(s));
      if (matchedSkills.length > 0) {
        score += Math.min(25, matchedSkills.length * 8);
        reasons.push(`Matches your skills: ${matchedSkills.slice(0, 3).join(', ')}`);
      } else {
        reasons.push('Relevant to current tech industry vacancies');
      }

      // Job type preference
      if (preferredTypes.length > 0 && preferredTypes.includes(job.jobType)) {
        score += 5;
        reasons.push(`Preferred job type: ${job.jobType}`);
      }

      // Work mode preference
      if (preferredModes.length > 0 && preferredModes.includes(job.workMode)) {
        score += 5;
        reasons.push(`Preferred work mode: ${job.workMode}`);
      }

      // Location match
      if (preferredLocation && job.location?.toLowerCase().includes(preferredLocation.toLowerCase())) {
        score += 5;
        reasons.push(`Near your location: ${job.location}`);
      }

      // Featured jobs get a small boost
      if (job.isFeatured) {
        score += 3;
        reasons.push('Featured position');
      }

      return {
        ...job,
        matchScore: Math.min(99, score),
        matchReason: reasons[0] || 'Relevant opportunity',
      };
    });

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
}
