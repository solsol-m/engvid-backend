import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    getByVideo(videoId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[], import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, CommentDocument, "find">;
    create(videoId: string, userId: string, userName: string, text: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    toggleLike(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    getAll(videoId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[], import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, CommentDocument, "find">;
    create(videoId: string, body: {
        text: string;
    }, req: any): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    like(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export declare class CommentsModule {
}
