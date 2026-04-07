import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VideosService } from './videos.service';

@Controller('videos')
@UseGuards(AuthGuard('jwt'))
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('level') level?: string,
  ) {
    return this.videosService.findAll(category, level);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.videosService.search(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findById(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
      },
      fileFilter: (req, file, cb) => {
        const ok = file.mimetype?.startsWith('video/');
        cb(
          ok ? null : new Error('نوع الملف غير مدعوم، ارفع ملف فيديو فقط'),
          ok,
        );
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.videosService.upload(file, body, req.user.userId);
  }

  @Post(':id/delete')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.videosService.delete(id, req.user.userId);
  }

  @Post(':id/update')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.videosService.update(id, body, req.user.userId);
  }
}
