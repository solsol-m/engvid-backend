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
        if (!video) throw new NotFoundException('الدرس غير موجود');
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

    async upload(file: Express.Multer.File | undefined, body: any, userId: string) {
        const tags = typeof body.tags === 'string' 
            ? body.tags.split(',').map(t => t.trim()).filter(Boolean) 
            : [];

        if (body.videoUrl) {
            let thumb = '';
            if (body.videoUrl.includes('youtube') || body.videoUrl.includes('youtu.be')) {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = body.videoUrl.match(regExp);
                if (match && match[2].length === 11) {
                    thumb = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
                }
            }
            
            return this.videoModel.create({
                ...body,
                tags,
                duration: Number(body.duration) || 0,
                thumbnailUrl: thumb || 'https://picsum.photos/seed/engvid/640/360',
                instructorId: userId,
            });
        }

        if (!file) throw new Error('يرجى اختيار ملف أو إدخال رابط فيديو');

        try {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: 'video',
                folder: 'engvid',
            });
            
            return this.videoModel.create({
                ...body,
                tags,
                videoUrl: result.secure_url,
                thumbnailUrl: result.eager?.[0]?.secure_url ?? result.thumbnail_url ?? '',
                duration: Math.round(result.duration ?? Number(body.duration) ?? 0),
                instructorId: userId,
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`تعذر رفع الفيديو: ${error.message}`);
        }
    }

    async delete(id: string, userId: string) {
        const video = await this.videoModel.findById(id);
        if (!video) throw new NotFoundException('الدرس غير موجود');
        
        // التحقق من الصلاحية (يمكن للمسؤول فقط الحذف)
        if (video.instructorId !== userId) {
            throw new Error('لا تملك الصلاحية لحذف هذا الدرس');
        }

        return this.videoModel.findByIdAndDelete(id);
    }

    async update(id: string, body: any, userId: string) {
        const video = await this.videoModel.findById(id);
        if (!video) throw new NotFoundException('الدرس غير موجود');
        
        if (video.instructorId !== userId) {
            throw new Error('لا تملك الصلاحية لتعديل هذا الدرس');
        }

        return this.videoModel.findByIdAndUpdate(id, body, { new: true });
    }
}