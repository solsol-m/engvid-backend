import { Controller, Get, Post, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
    constructor(private videosService: VideosService) { }

    @Get()
    findAll(@Query('category') category?: string, @Query('level') level?: string) {
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

    @Post(':id/like')
    @UseGuards(AuthGuard('jwt'))
    toggleLike(@Param('id') id: string, @Request() req: any) {
        return this.videosService.toggleLike(id, req.user.userId);
    }

    @Post('upload')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({ destination: './uploads' }),
    }))
    upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Request() req: any,
    ) {
        return this.videosService.upload(file, body, req.user.userId);
    }
}