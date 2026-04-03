import { Document } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    videoId: string;
    userId: string;
    userName: string;
    text: string;
    likedBy: string[];
    likes: number;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment> & Comment & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
}>;
