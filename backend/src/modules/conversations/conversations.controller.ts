import {
  Controller, Get, Post, Put, Param, Body, Req, UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { IsDateString, IsOptional, IsString, IsNumber, IsIn, IsUrl, Min, Max } from 'class-validator';
import { InterviewStatus } from './conversation.entity.js';
import { Type } from 'class-transformer';

class SendMessageDto {
  @IsString()
  content: string;
}

class ProposeInterviewDto {
  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(15)
  @Max(480)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class RespondInterviewDto {
  @IsIn([InterviewStatus.ACCEPTED, InterviewStatus.DECLINED])
  status: InterviewStatus.ACCEPTED | InterviewStatus.DECLINED;
}

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // ─── Conversations ────────────────────────────────────────────────────────

  @Get()
  async getMyConversations(@Req() req: any) {
    return this.conversationsService.getUserConversations(req.user.id || req.user.userId);
  }

  @Post('application/:applicationId')
  async getOrCreateByApplication(@Param('applicationId') applicationId: string, @Req() req: any) {
    return this.conversationsService.getOrCreateConversation(applicationId, req.user.id || req.user.userId);
  }

  @Get(':id')
  async getConversation(@Param('id') id: string, @Req() req: any) {
    return this.conversationsService.getConversationById(id, req.user.id || req.user.userId);
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() req: any) {
    return this.conversationsService.getMessages(id, req.user.id || req.user.userId);
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Req() req: any) {
    return this.conversationsService.sendMessage(id, req.user.id || req.user.userId, dto.content);
  }

  // ─── Interviews ───────────────────────────────────────────────────────────

  @Get(':id/interviews')
  async getInterviews(@Param('id') id: string, @Req() req: any) {
    return this.conversationsService.getInterviews(id, req.user.id || req.user.userId);
  }

  @Post(':id/interviews')
  async proposeInterview(@Param('id') id: string, @Body() dto: ProposeInterviewDto, @Req() req: any) {
    return this.conversationsService.proposeInterview(id, req.user.id || req.user.userId, {
      scheduledAt: new Date(dto.scheduledAt),
      durationMinutes: dto.durationMinutes,
      meetingLink: dto.meetingLink,
      notes: dto.notes,
    });
  }

  @Put('interviews/:interviewId/respond')
  async respondToInterview(
    @Param('interviewId') interviewId: string,
    @Body() dto: RespondInterviewDto,
    @Req() req: any,
  ) {
    return this.conversationsService.respondToInterview(interviewId, req.user.id || req.user.userId, dto.status);
  }

  @Put('interviews/:interviewId/cancel')
  async cancelInterview(@Param('interviewId') interviewId: string, @Req() req: any) {
    return this.conversationsService.cancelInterview(interviewId, req.user.id || req.user.userId);
  }
}
