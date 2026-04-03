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
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("./video.schema");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let VideosService = class VideosService {
    constructor(videoModel, config) {
        this.videoModel = videoModel;
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        });
    }
    async findAll(category, level) {
        const filter = {};
        if (category)
            filter.category = category;
        if (level)
            filter.level = level;
        return this.videoModel.find(filter).sort({ createdAt: -1 });
    }
    async findById(id) {
        const video = await this.videoModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        if (!video)
            throw new common_1.NotFoundException('الفيديو غير موجود');
        return video;
    }
    async search(query) {
        return this.videoModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
            ],
        });
    }
    async toggleLike(videoId, userId) {
        const video = await this.videoModel.findById(videoId);
        if (!video)
            throw new common_1.NotFoundException('الفيديو غير موجود');
        const liked = video.likedBy.includes(userId);
        if (liked) {
            video.likedBy = video.likedBy.filter((id) => id !== userId);
            video.likes = Math.max(0, video.likes - 1);
        }
        else {
            video.likedBy.push(userId);
            video.likes += 1;
        }
        return video.save();
    }
    async upload(file, body, userId) {
        const result = await cloudinary_1.v2.uploader.upload(file.path, {
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
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], VideosService);
//# sourceMappingURL=videos.service.js.map