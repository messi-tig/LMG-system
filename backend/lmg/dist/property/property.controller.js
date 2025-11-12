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
var PropertyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const mongoose_1 = require("mongoose");
const nestjs_i18n_1 = require("nestjs-i18n");
const property_service_1 = require("./property.service");
const merchantAuthGuard_1 = require("../merchant/merchantAuthGuard");
const property_dto_1 = require("./property.dto");
let PropertyController = PropertyController_1 = class PropertyController {
    propertyService;
    i18n;
    logger = new common_1.Logger(PropertyController_1.name);
    constructor(propertyService, i18n) {
        this.propertyService = propertyService;
        this.i18n = i18n;
    }
    async create(payload, files, req, lang) {
        this.logger.log('📥 Received property creation request');
        if (!files || files.length === 0) {
            const missingImageError = await this.i18n.translate('property.ERROR_IMAGE_REQUIRED', { lang });
            this.logger.error('❌ No images uploaded');
            throw new common_1.BadRequestException(missingImageError);
        }
        this.logger.log(`🖼️ ${files.length} image(s) received`);
        const merchantId = req.user?.sub;
        if (!merchantId || !mongoose_1.Types.ObjectId.isValid(merchantId)) {
            this.logger.error('❌ Invalid or missing merchant ID in JWT token');
            throw new common_1.BadRequestException('Invalid or missing merchant ID in token');
        }
        const createAssetPayload = {
            ...payload,
            imageFiles: files,
        };
        this.logger.log('🚀 Creating property via PropertyService...');
        const result = await this.propertyService.createProperty(new mongoose_1.Types.ObjectId(merchantId), createAssetPayload, lang);
        this.logger.log('✅ Property created successfully');
        return result;
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(merchantAuthGuard_1.MerchantJwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, nestjs_i18n_1.I18nLang)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [property_dto_1.CreateAssetDto,
        Array, Object, String]),
    __metadata("design:returntype", Promise)
], PropertyController.prototype, "create", null);
exports.PropertyController = PropertyController = PropertyController_1 = __decorate([
    (0, common_1.Controller)('merchant/properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService,
        nestjs_i18n_1.I18nService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map