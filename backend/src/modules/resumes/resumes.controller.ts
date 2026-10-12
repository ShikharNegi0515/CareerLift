import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  Body,
  Put,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage, diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { ResumesService } from './resumes.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

const uploadDir = join(process.cwd(), 'uploads', 'resumes');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Multipart file upload endpoint: stores file on disk, extracts PDF text & skills
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, DOC, DOCX, or TXT resume files are allowed'), false);
        }
      },
    }),
  )
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('syncSkills') syncSkills?: string,
  ) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Only job seekers can upload resumes');
    }
    if (!file) {
      throw new BadRequestException('No resume file provided');
    }

    // Save buffer to disk
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = extname(file.originalname) || '.pdf';
    const filename = `resume-${uniqueSuffix}${extension}`;
    const filePath = join(uploadDir, filename);

    writeFileSync(filePath, file.buffer);

    return this.resumesService.processAndSaveResume(
      req.user.id || req.user.userId,
      {
        originalname: file.originalname,
        filename,
        path: filePath,
        size: file.size,
        buffer: file.buffer,
        mimetype: file.mimetype,
      },
      syncSkills !== 'false',
    );
  }

  @Post()
  async uploadResume(@Req() req: any, @Body() body: { fileName: string; fileUrl: string; fileSize: number }) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Only job seekers can upload resumes');
    }
    return this.resumesService.uploadResume(req.user.id || req.user.userId, body.fileName, body.fileUrl, body.fileSize);
  }

  @Get('me')
  async getMyResumes(@Req() req: any) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Only job seekers can view their resumes');
    }
    return this.resumesService.findByUser(req.user.id || req.user.userId);
  }

  @Put(':id/default')
  async setDefault(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Only job seekers can update resumes');
    }
    return this.resumesService.setDefault(req.user.id || req.user.userId, id);
  }

  @Delete(':id')
  async deleteResume(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'job_seeker') {
      throw new UnauthorizedException('Only job seekers can delete resumes');
    }
    return this.resumesService.delete(req.user.id || req.user.userId, id);
  }
}
