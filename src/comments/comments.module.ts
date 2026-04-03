import { Module, Injectable, Controller, Get, Post, Delete, Param, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Comment, CommentDocument, CommentSchema } from './comment.schema';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

    getByVideo(videoId: string) {
        return this.commentModel.find({ videoId }).sort({ createdAt: -1 });
    }

    create(videoId: string, userId: string, userName: string, text: string) {
        return this.commentModel.create({ videoId, userId, userName, text });
    }

    async delete(id: string, userId: string) {
        const comment = await this.commentModel.findById(id);
        if (!comment) throw new NotFoundException();
        if (comment.userId !== userId) throw new NotFoundException('غير مسموح');
        return comment.deleteOne();
    }

    async toggleLike(id: string, userId: string) {
        const comment = await this.commentModel.findById(id);
        if (!comment) throw new NotFoundException();
        const liked = comment.likedBy.includes(userId);
        if (liked) {
            comment.likedBy = comment.likedBy.filter(u => u !== userId);
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            comment.likedBy.push(userId);
            comment.likes += 1;
        }
        return comment.save();
    }
}

@Controller('videos/:videoId/comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
    constructor(private commentsService: CommentsService) { }

    @Get()
    getAll(@Param('videoId') videoId: string) {
        return this.commentsService.getByVideo(videoId);
    }

    @Post()
    create(@Param('videoId') videoId: string, @Body() body: { text: string }, @Request() req: any) {
        return this.commentsService.create(videoId, req.user.userId, req.user.email, body.text);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.delete(id, req.user.userId);
    }

    @Post(':id/like')
    like(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.toggleLike(id, req.user.userId);
    }
}

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
    providers: [CommentsService],
    controllers: [CommentsController],
})
export class CommentsModule { }