// ================================
// SHARED ENUMS
// ================================

export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

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

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  EXECUTIVE = 'executive',
}

// ================================
// USER & AUTH
// ================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole.JOB_SEEKER | UserRole.EMPLOYER;
  companyName?: string;
  jobTitle?: string;
  companyWebsite?: string;
  registrationNumber?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  inviteToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ================================
// JOB CATEGORY
// ================================

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  jobCount?: number;
}

// ================================
// SKILL
// ================================

export interface Skill {
  id: string;
  name: string;
  slug: string;
}

// ================================
// COMPANY
// ================================

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
  jobCount?: number;
  isVerified?: boolean;
  createdAt: string;
}

// ================================
// JOB
// ================================

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  applicationDeadline?: string;
  externalApplicationUrl?: string;
  status: JobStatus;
  isFeatured: boolean;
  viewCount: number;
  applicationCount: number;
  company: Company;
  category: JobCategory;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
  // frontend-only: whether current user has saved this job
  isSaved?: boolean;
}

// ================================
// JOB SEARCH FILTERS
// ================================

export interface JobFilters {
  keyword?: string;
  location?: string;
  categoryId?: string;
  jobType?: JobType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  sortBy?: 'newest' | 'relevant';
  page?: number;
  limit?: number;
}

// ================================
// APPLICATION
// ================================

export interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  job: Job;
  applicant: JobSeekerProfile;
  createdAt: string;
  updatedAt: string;
}

// ================================
// JOB SEEKER PROFILE
// ================================

export interface JobSeekerProfile {
  id: string;
  user: User;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  headline?: string;
  experience?: WorkExperience[];
  education?: Education[];
  skills: Skill[];
  preferredJobTypes?: JobType[];
  preferredWorkModes?: WorkMode[];
  preferredLocations?: string[];
  resumes?: Resume[];
  createdAt: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

// ================================
// RESUME
// ================================

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  isDefault: boolean;
  parsedSkills?: string[];
  parsedText?: string;
  createdAt: string;
}

// ================================
// EMPLOYER PROFILE
// ================================

export interface EmployerProfile {
  id: string;
  user: User;
  title?: string;
  company?: Company;
}

// ================================
// BLOG
// ================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author: User;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

// ================================
// PAGINATION
// ================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ================================
// COMMON API RESPONSE
// ================================

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
}
