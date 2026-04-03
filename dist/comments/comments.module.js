"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = exports.CommentsController = exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const passport_1 = require("@nestjs/passport");
const comment_schema_1 = require("./comment.schema");
let CommentsService = class CommentsService {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    getByVideo(videoId) {
        return this.commentModel.find({ videoId }).sort({ createdAt: -1 });
    }
    create(videoId, userId, userName, text) {
        return this.commentModel.create({ videoId, userId, userName, text });
    }
    async delete(id, userId) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new common_1.NotFoundException();
        if (comment.userId !== userId)
            throw new common_1.NotFoundException('غير مسموح');
        return comment.deleteOne();
    }
    async toggleLike(id, userId) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new common_1.NotFoundException();
        const liked = comment.likedBy.includes(userId);
        if (liked) {
            comment.likedBy = comment.likedBy.filter(u => u !== userId);
            comment.likes = Math.max(0, comment.likes - 1);
        }
        else {
            comment.likedBy.push(userId);
            comment.likes += 1;
        }
        return comment.save();
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    getAll(videoId) {
        return this.commentsService.getByVideo(videoId);
    }
    create(videoId, body, req) {
        return this.commentsService.create(videoId, req.user.userId, req.user.email, body.text);
    }
    delete(id, req) {
        return this.commentsService.delete(id, req.user.userId);
    }
    like(id, req) {
        return this.commentsService.toggleLike(id, req.user.userId);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "like", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('videos/:videoId/comments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [CommentsService])
], CommentsController);
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema }])],
        providers: [CommentsService],
        controllers: [CommentsController],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map