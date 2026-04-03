import { Model, Document } from 'mongoose';
export type ProgressDocument = Progress & Document;
export declare class Progress {
    userId: string;
    videoId: string;
    percent: number;
    lastPositionSeconds: number;
    completed: boolean;
}
export declare const ProgressSchema: import("mongoose").Schema<Progress, Model<Progress, any, any, any, Document<unknown, any, Progress> & Progress & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Progress, Document<unknown, {}, import("mongoose").FlatRecord<Progress>> & import("mongoose").FlatRecord<Progress> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class ProgressService {
    private progressModel;
    constructor(progressModel: Model<ProgressDocument>);
    getUserProgress(userId: string): import("mongoose").Query<(Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[], Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, ProgressDocument, "find">;
    getVideoProgress(userId: string, videoId: string): import("mongoose").Query<Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, ProgressDocument, "findOne">;
    upsert(userId: string, videoId: string, percent: number, lastPositionSeconds: number): Promise<Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    getAll(req: any): import("mongoose").Query<(Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[], Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, ProgressDocument, "find">;
    getOne(videoId: string, req: any): import("mongoose").Query<Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, ProgressDocument, "findOne">;
    update(videoId: string, body: {
        percent: number;
        lastPositionSeconds: number;
    }, req: any): Promise<Document<unknown, {}, ProgressDocument> & Progress & Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
export declare class ProgressModule {
}
