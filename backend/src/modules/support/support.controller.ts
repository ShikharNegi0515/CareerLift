import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SupportService } from './support.service.js';
import { TicketStatus, TicketPriority } from './support-ticket.entity.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Public } from '../auth/public.decorator.js';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Any visitor can submit a support ticket (contact form)
  @Public()
  @Post()
  async createTicket(@Req() req: any, @Body() body: {
    name: string;
    email: string;
    subject: string;
    message: string;
    priority?: TicketPriority;
  }) {
    const userId = req.user?.userId;
    return this.supportService.create({ ...body, userId });
  }

  // Authenticated users view their own tickets
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyTickets(@Req() req: any) {
    return this.supportService.findByUser(req.user.userId);
  }

  // Admin-only: list all tickets
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTickets(@Req() req: any, @Query('status') status?: string) {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Only administrators can view all support tickets');
    }
    return this.supportService.findAll(status);
  }

  // Admin-only: update ticket status and optionally reply
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTicket(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: TicketStatus; adminReply?: string },
  ) {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Only administrators can update support tickets');
    }
    return this.supportService.updateStatus(id, body.status, body.adminReply);
  }
}
