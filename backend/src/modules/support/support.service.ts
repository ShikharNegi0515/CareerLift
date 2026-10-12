import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus, TicketPriority } from './support-ticket.entity.js';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
  ) {}

  async create(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string;
    priority?: TicketPriority;
  }): Promise<SupportTicket> {
    const ticket = this.ticketRepository.create({
      ...data,
      status: TicketStatus.OPEN,
      priority: data.priority || TicketPriority.MEDIUM,
    });
    return this.ticketRepository.save(ticket);
  }

  async findAll(status?: string): Promise<SupportTicket[]> {
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .orderBy('ticket.createdAt', 'DESC');

    if (status && status !== 'all') {
      query.andWhere('ticket.status = :status', { status });
    }

    return query.getMany();
  }

  async findByUser(userId: string): Promise<SupportTicket[]> {
    return this.ticketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    adminReply?: string,
  ): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }

    ticket.status = status;
    if (adminReply !== undefined) {
      ticket.adminReply = adminReply;
    }

    return this.ticketRepository.save(ticket);
  }
}
