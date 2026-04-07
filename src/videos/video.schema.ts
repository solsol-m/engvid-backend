import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  level: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  videoUrl: string;

  @Prop()
  cloudinaryPublicId?: string;

  @Prop()
  thumbnailUrl: string;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ required: true })
  instructorId: string;

  @Prop({ default: 0 })
  views: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
