import { Document } from 'mongoose';
export type VideoDocument = Video & Document;
export declare class Video {
    title: string;
    description: string;
    category: string;
    level: string;
    tags: string[];
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    instructorId: string;
    likedBy: string[];
    likes: number;
    views: number;
}
export declare const VideoSchema: import("mongoose").Schema<Video, import("mongoose").Model<Video, any, any, any, Document<unknown, any, Video> & Video & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Video, Document<unknown, {}, import("mongoose").FlatRecord<Video>> & import("mongoose").FlatRecord<Video> & {
    _id: import("mongoose").Types.ObjectId;
}>;
