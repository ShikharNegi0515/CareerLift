import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JobSeekerProfile } from '../users/job-seeker-profile.entity.js';
import { EmployerProfile } from '../users/employer-profile.entity.js';
import { Company } from '../companies/company.entity.js';
import { EmailService } from '../email/email.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(JobSeekerProfile)
    private seekerProfileRepository: Repository<JobSeekerProfile>,
    @InjectRepository(EmployerProfile)
    private employerProfileRepository: Repository<EmployerProfile>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash: hash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create appropriate profile based on role
    if (dto.role === UserRole.JOB_SEEKER) {
      const profile = this.seekerProfileRepository.create({ user: savedUser });
      await this.seekerProfileRepository.save(profile);
    } else if (dto.role === UserRole.EMPLOYER) {
      let company = null;
      if (dto.companyName) {
        const slug =
          dto.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') +
          '-' +
          Date.now();

        company = this.companiesRepository.create({
          name: dto.companyName.trim(),
          slug,
          website: dto.companyWebsite || undefined,
          industry: dto.industry || undefined,
          size: dto.companySize || undefined,
          location: dto.location || undefined,
          registrationNumber: dto.registrationNumber || undefined,
          isVerified: false, // Default unverified until reviewed/approved
        });
        company = await this.companiesRepository.save(company);
      }

      const profile = this.employerProfileRepository.create({
        user: savedUser,
        title: dto.jobTitle || 'Hiring Manager',
        company: company || undefined,
      });
      await this.employerProfileRepository.save(profile);
    }

    // Trigger asynchronous welcome email
    const fullName = [savedUser.firstName, savedUser.lastName].filter(Boolean).join(' ') || savedUser.email;
    this.emailService.sendWelcomeEmail(fullName, savedUser.email, savedUser.role).catch((err) => {
      console.warn('Failed to send welcome email:', err);
    });

    return this.generateTokens(savedUser);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });
      const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
      
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        throw new UnauthorizedException();
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersRepository.update(userId, { refreshTokenHash: null });
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'secret',
        expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
      }),
    ]);

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.usersRepository.update(user.id, { refreshTokenHash: hash });

    // Remove sensitive data
    const { passwordHash, refreshTokenHash, ...userWithoutSensitiveInfo } = user;

    return {
      user: userWithoutSensitiveInfo,
      accessToken,
      refreshToken,
    };
  }
}
