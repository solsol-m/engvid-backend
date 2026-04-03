import { VideosService } from './videos.service';
export declare class VideosController {
    private videosService;
    constructor(videosService: VideosService);
    findAll(category?: string, level?: string): Promise<(import("mongoose").Document<unknown, {}, import("./video.schema").VideoDocument> & import("./video.schema").Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    search(q: string): Promise<(import("mongoose").Document<unknown, {}, import("./video.schema").VideoDocument> & import("./video.schema").Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./video.schema").VideoDocument> & import("./video.schema").Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    toggleLike(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./video.schema").VideoDocument> & import("./video.schema").Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    upload(file: Express.Multer.File, body: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./video.schema").VideoDocument> & import("./video.schema").Video & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
