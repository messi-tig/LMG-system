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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nestjs_i18n_1 = require("nestjs-i18n");
const property_schema_1 = require("./property.schema");
const user_schema_1 = require("../schema/user.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let PropertyService = class PropertyService {
    assetModel;
    userModel;
    i18n;
    cloudinaryService;
    constructor(assetModel, userModel, i18n, cloudinaryService) {
        this.assetModel = assetModel;
        this.userModel = userModel;
        this.i18n = i18n;
        this.cloudinaryService = cloudinaryService;
    }
    async createProperty(merchantId, assetPayload, lang) {
        const { name, description, category, rentalPriceperday, rentalPriceperhour, rentalPriceperweek, rentalPricepermonth, rentalPriceperyear, numberOfProperty, imageFiles, } = assetPayload;
        const missingFieldsError = await this.i18n.translate('property.ERROR_REQUIRED_FIELDS', { lang });
        const successMessage = await this.i18n.translate('property.SUCCESS_PROPERTY_CREATED', { lang });
        const notMerchantError = await this.i18n.translate('property.ERROR_NOT_MERCHANT', { lang });
        const merchant = await this.userModel.findById(merchantId).exec();
        if (!merchant || merchant.role !== user_schema_1.UserRole.MERCHANT) {
            throw new common_1.ForbiddenException(notMerchantError);
        }
        if (!imageFiles || imageFiles.length === 0) {
            throw new common_1.BadRequestException(missingFieldsError);
        }
        const imageUrls = [];
        try {
            for (const file of imageFiles) {
                const uploadedUrl = await this.cloudinaryService.uploadImage(file, 'property-images');
                if (uploadedUrl)
                    imageUrls.push(uploadedUrl);
            }
        }
        catch (error) {
            console.error('❌ Cloudinary upload failed:', error);
            throw new common_1.InternalServerErrorException('Failed to upload images to Cloudinary.');
        }
        const newAsset = new this.assetModel({
            merchant: merchantId,
            name,
            description,
            category,
            rentalPriceperday,
            rentalPriceperhour,
            rentalPriceperweek,
            rentalPricepermonth,
            rentalPriceperyear,
            numberOfProperty,
            imageUrls,
            status: property_schema_1.AssetStatus.AVAILABLE,
        });
        await newAsset.save();
        const populatedAsset = await newAsset.populate('merchant', 'fullName email phonenumber businessName accountnumber');
        return {
            message: successMessage,
            asset: populatedAsset,
        };
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Asset.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        nestjs_i18n_1.I18nService,
        cloudinary_service_1.CloudinaryService])
], PropertyService);
//# sourceMappingURL=property.service.js.map