import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, Message, Interview, InterviewStatus } from './conversation.entity.js';
import { Application } from '../applications/application.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '../notifications/notification.entity.js';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── CONVERSATIONS ─────────────────────────────────────────────────────────

  /** Get or create a conversation for a given application */
  async getOrCreateConversation(applicationId: string, requesterId: string): Promise<Conversation> {
    const existing = await this.convRepo.findOne({ where: { applicationId } });
    if (existing) {
      this.assertParticipant(existing, requesterId);
      return existing;
    }

    // Load application to get seeker/employer ids
    const application = await this.applicationRepo.createQueryBuilder('app')
      .leftJoinAndSelect('app.applicant', 'applicant')
      .leftJoinAndSelect('app.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .innerJoin('company.employerProfiles', 'ep')
      .innerJoin('ep.user', 'employer')
      .addSelect('employer.id', 'employerId')
      .where('app.id = :id', { id: applicationId })
      .getOne();

    if (!application) throw new NotFoundException('Application not found');

    // Get the employer user id from the company's employer profiles
    const epResult = await this.applicationRepo.query(
      `SELECT u.id FROM users u
       INNER JOIN employer_profiles ep ON ep.user_id = u.id
       INNER JOIN companies c ON c.id = ep.company_id
       INNER JOIN jobs j ON j.company_id = c.id
       INNER JOIN applications a ON a.job_id = j.id
       WHERE a.id = $1 LIMIT 1`,
      [applicationId],
    );

    const employerId = epResult?.[0]?.id;
    if (!employerId) throw new BadRequestException('Could not determine employer for this application');

    const conv = this.convRepo.create({
      applicationId,
      seekerId: (application.applicant as any).id,
      employerId,
      jobTitle: (application as any).job?.title,
      companyName: (application as any).job?.company?.name,
    });

    return this.convRepo.save(conv);
  }

  async getConversationById(id: string, requesterId: string): Promise<Conversation> {
    const conv = await this.convRepo.findOne({ where: { id } });
    if (!conv) throw new NotFoundException('Conversation not found');
    this.assertParticipant(conv, requesterId);
    return conv;
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return this.convRepo.find({
      where: [{ seekerId: userId }, { employerId: userId }],
      order: { updatedAt: 'DESC' },
    });
  }

  // ─── MESSAGES ──────────────────────────────────────────────────────────────

  async getMessages(conversationId: string, requesterId: string): Promise<Message[]> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    this.assertParticipant(conv, requesterId);

    // Mark messages as read for this user
    const isSeeker = conv.seekerId === requesterId;
    if (isSeeker) {
      await this.messageRepo.update({ conversationId, isReadBySeeker: false }, { isReadBySeeker: true });
    } else {
      await this.messageRepo.update({ conversationId, isReadByEmployer: false }, { isReadByEmployer: true });
    }

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    this.assertParticipant(conv, senderId);

    const isSeeker = conv.seekerId === senderId;

    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
      isReadBySeeker: isSeeker,
      isReadByEmployer: !isSeeker,
    });
    const saved = await this.messageRepo.save(message);

    // Update conversation updatedAt for ordering
    await this.convRepo.update(conversationId, { updatedAt: new Date() });

    // Send in-app notification to the other party
    const recipientId = isSeeker ? conv.employerId : conv.seekerId;
    const senderLabel = isSeeker ? 'Job Seeker' : `${conv.companyName || 'Employer'}`;
    await this.notificationsService.create({
      userId: recipientId,
      type: NotificationType.SYSTEM,
      title: 'New Message',
      message: `${senderLabel} sent you a message regarding "${conv.jobTitle || 'a position'}".`,
      link: `/messages/${conversationId}`,
    });

    return saved;
  }

  // ─── INTERVIEWS ────────────────────────────────────────────────────────────

  async getInterviews(conversationId: string, requesterId: string): Promise<Interview[]> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    this.assertParticipant(conv, requesterId);
    return this.interviewRepo.find({ where: { conversationId }, order: { createdAt: 'DESC' } });
  }

  async proposeInterview(
    conversationId: string,
    employerId: string,
    data: {
      scheduledAt: Date;
      durationMinutes?: number;
      meetingLink?: string;
      notes?: string;
    },
  ): Promise<Interview> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.employerId !== employerId) throw new ForbiddenException('Only the employer can propose an interview');

    const interview = this.interviewRepo.create({
      conversationId,
      proposedById: employerId,
      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes ?? 60,
      meetingLink: data.meetingLink,
      notes: data.notes,
      status: InterviewStatus.PENDING,
    });
    const saved = await this.interviewRepo.save(interview);

    // Notify seeker
    const dateStr = new Date(data.scheduledAt).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    await this.notificationsService.create({
      userId: conv.seekerId,
      type: NotificationType.SYSTEM,
      title: '📅 Interview Invitation',
      message: `${conv.companyName || 'An employer'} has proposed an interview for "${conv.jobTitle || 'a position'}" on ${dateStr}.`,
      link: `/messages/${conversationId}`,
    });

    return saved;
  }

  async respondToInterview(
    interviewId: string,
    seekerId: string,
    status: InterviewStatus.ACCEPTED | InterviewStatus.DECLINED,
  ): Promise<Interview> {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId } });
    if (!interview) throw new NotFoundException('Interview not found');

    const conv = await this.convRepo.findOne({ where: { id: interview.conversationId } });
    if (!conv || conv.seekerId !== seekerId) throw new ForbiddenException('Only the invited seeker can respond');

    interview.status = status;
    const updated = await this.interviewRepo.save(interview);

    // Notify employer
    await this.notificationsService.create({
      userId: conv.employerId,
      type: NotificationType.SYSTEM,
      title: `Interview ${status === InterviewStatus.ACCEPTED ? '✅ Accepted' : '❌ Declined'}`,
      message: `The candidate has ${status} the interview for "${conv.jobTitle || 'a position'}".`,
      link: `/employer/applicants`,
    });

    return updated;
  }

  async cancelInterview(interviewId: string, employerId: string): Promise<Interview> {
    const interview = await this.interviewRepo.findOne({ where: { id: interviewId } });
    if (!interview) throw new NotFoundException('Interview not found');

    const conv = await this.convRepo.findOne({ where: { id: interview.conversationId } });
    if (!conv || conv.employerId !== employerId) throw new ForbiddenException('Only the employer can cancel');

    interview.status = InterviewStatus.CANCELLED;
    const updated = await this.interviewRepo.save(interview);

    await this.notificationsService.create({
      userId: conv.seekerId,
      type: NotificationType.SYSTEM,
      title: 'Interview Cancelled',
      message: `${conv.companyName || 'The employer'} has cancelled the interview for "${conv.jobTitle}".`,
      link: `/messages/${conv.id}`,
    });

    return updated;
  }

  // ─── HELPER ────────────────────────────────────────────────────────────────

  private assertParticipant(conv: Conversation, userId: string) {
    if (conv.seekerId !== userId && conv.employerId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }
  }
}
