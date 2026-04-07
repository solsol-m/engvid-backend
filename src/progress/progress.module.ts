import {
  Module,
  Injectable,
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MongooseModule, InjectModel } from '@nestjs/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) videoId: string;
  @Prop({ default: 0, min: 0, max: 100 }) percent: number;
  @Prop({ default: 0 }) lastPositionSeconds: number;
  @Prop({ default: false }) completed: boolean;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
ProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  getUserProgress(userId: string) {
    return this.progressModel.find({ userId });
  }

  getVideoProgress(userId: string, videoId: string) {
    return this.progressModel.findOne({ userId, videoId });
  }

  async upsert(
    userId: string,
    videoId: string,
    percent: number,
    lastPositionSeconds: number,
  ) {
    return this.progressModel.findOneAndUpdate(
      { userId, videoId },
      { percent, lastPositionSeconds, completed: percent >= 95 },
      { upsert: true, new: true },
    );
  }
}

@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.userId);
  }

  @Get(':videoId')
  getOne(@Param('videoId') videoId: string, @Request() req: any) {
    return this.progressService.getVideoProgress(req.user.userId, videoId);
  }

  @Post(':videoId')
  update(
    @Param('videoId') videoId: string,
    @Body() body: { percent: number; lastPositionSeconds: number },
    @Request() req: any,
  ) {
    return this.progressService.upsert(
      req.user.userId,
      videoId,
      body.percent,
      body.lastPositionSeconds,
    );
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
})
export class ProgressModule {}
