import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import {
  getWelcomeEmailHtml,
  getApplicationReceivedEmailHtml,
  getApplicationStatusUpdatedEmailHtml,
  getNewApplicantEmployerEmailHtml,
} from './email-templates.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;
  private readonly frontendUrl: string;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    this.fromAddress = this.configService.get<string>('EMAIL_FROM') || 'no-reply@careerlift.io';

    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT')) || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    // If real credentials are provided and not placeholders, connect to SMTP
    if (host && user && pass && !user.includes('your_email')) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Configured live SMTP transporter (${host}:${port})`);
    } else {
      // In development or when credentials are dummy, log cleanly without throwing
      this.logger.log('SMTP credentials not configured or set to placeholder. EmailService running in simulated console mode.');
    }
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const mailOptions = {
      from: `CareerLift <${this.fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    };

    if (this.transporter) {
      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email dispatched to ${options.to}: "${options.subject}"`);
        return true;
      } catch (err: any) {
        this.logger.error(`Failed to send email to ${options.to}: ${err.message}`, err.stack);
        return false;
      }
    } else {
      // Simulation mode
      this.logger.log(`[SIMULATED EMAIL] To: ${options.to} | Subject: "${options.subject}"`);
      return true;
    }
  }

  async sendWelcomeEmail(name: string, email: string, role: string): Promise<boolean> {
    const html = getWelcomeEmailHtml(name, role, this.frontendUrl);
    return this.sendMail({
      to: email,
      subject: `Welcome to CareerLift, ${name}! 🚀`,
      html,
    });
  }

  async sendApplicationReceivedEmail(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    companyName: string,
  ): Promise<boolean> {
    const html = getApplicationReceivedEmailHtml(candidateName, jobTitle, companyName, this.frontendUrl);
    return this.sendMail({
      to: candidateEmail,
      subject: `Application Submitted: ${jobTitle} at ${companyName}`,
      html,
    });
  }

  async sendApplicationStatusUpdatedEmail(
    candidateEmail: string,
    candidateName: string,
    jobTitle: string,
    companyName: string,
    newStatus: string,
  ): Promise<boolean> {
    const html = getApplicationStatusUpdatedEmailHtml(candidateName, jobTitle, companyName, newStatus, this.frontendUrl);
    return this.sendMail({
      to: candidateEmail,
      subject: `Update on your application for ${jobTitle} (${newStatus.toUpperCase()})`,
      html,
    });
  }

  async sendNewApplicantEmployerEmail(
    employerEmail: string,
    employerName: string,
    candidateName: string,
    jobTitle: string,
  ): Promise<boolean> {
    const html = getNewApplicantEmployerEmailHtml(employerName, candidateName, jobTitle, this.frontendUrl);
    return this.sendMail({
      to: employerEmail,
      subject: `New Application Received: ${candidateName} for ${jobTitle}`,
      html,
    });
  }
}
