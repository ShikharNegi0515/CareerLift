import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../user.entity.js';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum([UserRole.JOB_SEEKER, UserRole.EMPLOYER])
  role: UserRole;
}
