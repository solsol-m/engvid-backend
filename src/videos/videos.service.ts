import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        private config: ConfigService,
    ) {
        cloudinary.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        });
    }

    async findAll(category?: string, level?: string) {
        const filter: Record<string, string> = {};
        if (category) filter.category = category;
        if (level) filter.level = level;
        return this.videoModel.find(filter).sort({ createdAt: -1 });
    }

    async findById(id: string) {
        const video = await this.videoModel.findByIdAndUpdate(
            id, { $inc: { views: 1 } }, { new: true }
        );
        if (!video) throw new NotFoundException('الفيديو غير موجود');
        return video;
    }

    async search(query: string) {
        return this.videoModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
            ],
        });
    }

    async toggleLike(videoId: string, userId: string) {
        const video = await this.videoModel.findById(videoId);
        if (!video) throw new NotFoundException('الفيديو غير موجود');
        const liked = video.likedBy.includes(userId);
        if (liked) {
            video.likedBy = video.likedBy.filter((id) => id !== userId);
            video.likes = Math.max(0, video.likes - 1);
        } else {
            video.likedBy.push(userId);
            video.likes += 1;
        }
        return video.save();
    }

    async upload(file: Express.Multer.File, body: any, userId: string) {
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'video',
            folder: 'engvid',
        });
        return this.videoModel.create({
            ...body,
            videoUrl: result.secure_url,
            thumbnailUrl: result.eager?.[0]?.secure_url ?? '',
            duration: Math.round(result.duration ?? 0),
            instructorId: userId,
        });
    }
}