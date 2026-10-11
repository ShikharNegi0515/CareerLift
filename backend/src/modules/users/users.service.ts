import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeekerProfile } from './job-seeker-profile.entity.js';
import { User } from '../auth/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(JobSeekerProfile)
    private seekerProfileRepository: Repository<JobSeekerProfile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getSeekerProfile(userId: string): Promise<{ user: User; profile: JobSeekerProfile }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = await this.seekerProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      profile = this.seekerProfileRepository.create({
        user,
        skills: [],
        experience: [],
        education: [],
        preferredJobTypes: [],
        preferredWorkModes: [],
        preferredLocations: [],
      });
      profile = await this.seekerProfileRepository.save(profile);
    }

    const { passwordHash, refreshTokenHash, ...userClean } = user as any;

    return {
      user: userClean,
      profile,
    };
  }

  async updateSeekerProfile(userId: string, data: any): Promise<JobSeekerProfile> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.firstName || data.lastName) {
      if (data.firstName) user.firstName = data.firstName;
      if (data.lastName) user.lastName = data.lastName;
      await this.usersRepository.save(user);
    }

    let profile = await this.seekerProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      profile = this.seekerProfileRepository.create({ user });
    }

    if (data.headline !== undefined) profile.headline = data.headline;
    if (data.bio !== undefined) profile.bio = data.bio;
    if (data.phone !== undefined) profile.phone = data.phone;
    if (data.location !== undefined) profile.location = data.location;
    if (data.website !== undefined) profile.website = data.website;
    if (data.linkedinUrl !== undefined) profile.linkedinUrl = data.linkedinUrl;
    if (data.githubUrl !== undefined) profile.githubUrl = data.githubUrl;
    if (data.skills !== undefined) profile.skills = data.skills;
    if (data.experience !== undefined) profile.experience = data.experience;
    if (data.education !== undefined) profile.education = data.education;
    if (data.preferredJobTypes !== undefined) profile.preferredJobTypes = data.preferredJobTypes;
    if (data.preferredWorkModes !== undefined) profile.preferredWorkModes = data.preferredWorkModes;
    if (data.preferredLocations !== undefined) profile.preferredLocations = data.preferredLocations;

    return this.seekerProfileRepository.save(profile);
  }
}
