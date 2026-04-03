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
exports.ProgressModule = exports.ProgressController = exports.ProgressService = exports.ProgressSchema = exports.Progress = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mongoose_3 = require("mongoose");
const passport_1 = require("@nestjs/passport");
let Progress = class Progress {
};
exports.Progress = Progress;
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], Progress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], Progress.prototype, "videoId", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Progress.prototype, "percent", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "lastPositionSeconds", void 0);
__decorate([
    (0, mongoose_2.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Progress.prototype, "completed", void 0);
exports.Progress = Progress = __decorate([
    (0, mongoose_2.Schema)({ timestamps: true })
], Progress);
exports.ProgressSchema = mongoose_2.SchemaFactory.createForClass(Progress);
exports.ProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });
let ProgressService = class ProgressService {
    constructor(progressModel) {
        this.progressModel = progressModel;
    }
    getUserProgress(userId) {
        return this.progressModel.find({ userId });
    }
    getVideoProgress(userId, videoId) {
        return this.progressModel.findOne({ userId, videoId });
    }
    async upsert(userId, videoId, percent, lastPositionSeconds) {
        return this.progressModel.findOneAndUpdate({ userId, videoId }, { percent, lastPositionSeconds, completed: percent >= 95 }, { upsert: true, new: true });
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Progress.name)),
    __metadata("design:paramtypes", [mongoose_3.Model])
], ProgressService);
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    getAll(req) {
        return this.progressService.getUserProgress(req.user.userId);
    }
    getOne(videoId, req) {
        return this.progressService.getVideoProgress(req.user.userId, videoId);
    }
    update(videoId, body, req) {
        return this.progressService.upsert(req.user.userId, videoId, body.percent, body.lastPositionSeconds);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "update", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [ProgressService])
], ProgressController);
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: Progress.name, schema: exports.ProgressSchema }])],
        providers: [ProgressService],
        controllers: [ProgressController],
    })
], ProgressModule);
//# sourceMappingURL=progress.module.js.map