import { Controller, Post, Body, Req, Res, Get, Query, UseGuards, HttpCode, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { Public } from './public.decorator.js';
import { IsEmail, IsString, MinLength } from 'class-validator';

class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const { user, accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken);
    this.setRefreshTokenCookie(res, newRefreshToken);
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    const { passwordHash, refreshTokenHash, resetPasswordToken, emailVerificationToken, ...user } = req.user;
    return user;
  }

  // ─── Password Reset ────────────────────────────────────────

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Password has been reset successfully. Please log in again.' };
  }

  // ─── Email Verification ───────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('send-verification-email')
  @HttpCode(200)
  async sendVerificationEmail(@Req() req: any) {
    await this.authService.sendVerificationEmail(req.user.id);
    return { message: 'Verification email sent. Please check your inbox.' };
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully! You can now log in.' };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

