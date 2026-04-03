import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.schema';
import { ConfigService } from '@nestjs/config';
export declare class VideosService {
    private videoModel;
    private config;
    constructor(videoModel: Model<VideoDocument>, config: ConfigService);
    findAll(category?: string, level?: string): Promise<(import("mongoose").Document<unknown, {}, VideoDocument> & Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, VideoDocument> & Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    search(query: string): Promise<(import("mongoose").Document<unknown, {}, VideoDocument> & Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    toggleLike(videoId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, VideoDocument> & Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    upload(file: Express.Multer.File, body: any, userId: string): Promise<import("mongoose").Document<unknown, {}, VideoDocument> & Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
