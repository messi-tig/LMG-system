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
var CustomerOperationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerOperationsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const operation_customer_service_1 = require("./operation-customer.service");
const customerAuthGuard_1 = require("../customer/customerAuthGuard");
let CustomerOperationsController = CustomerOperationsController_1 = class CustomerOperationsController {
    customerOpsService;
    logger = new common_1.Logger(CustomerOperationsController_1.name);
    constructor(customerOpsService) {
        this.customerOpsService = customerOpsService;
    }
    async getPropertiesByCategory(category, req) {
        try {
            const lang = req.query.lang || 'en';
            return await this.customerOpsService.getPropertiesByCategory(category, lang);
        }
        catch (error) {
            this.logger.error('❌ Error fetching properties by category:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch properties.');
        }
    }
    async getMyBookings(req) {
        try {
            const lang = req.query.lang || 'en';
            const customerId = new mongoose_1.Types.ObjectId(req.user.sub);
            return await this.customerOpsService.getMyBookings(customerId, lang);
        }
        catch (error) {
            this.logger.error('❌ Error fetching customer bookings:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch bookings.');
        }
    }
    async getAllBookings(req) {
        try {
            const lang = req.query.lang || 'en';
            return await this.customerOpsService.getAllBookings(lang);
        }
        catch (error) {
            this.logger.error('❌ Error fetching all bookings:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch all bookings.');
        }
    }
    async uploadPaymentProof(req, bookingId, file) {
        this.logger.log('📤 Uploading payment proof...');
        const lang = req.query.lang || 'en';
        try {
            if (!file) {
                throw new common_1.BadRequestException('Payment proof image is required.');
            }
            const customerId = new mongoose_1.Types.ObjectId(req.user.sub);
            return await this.customerOpsService.uploadPaymentProof(customerId, new mongoose_1.Types.ObjectId(bookingId), file, lang);
        }
        catch (error) {
            this.logger.error('❌ Error uploading payment proof:', error);
            throw new common_1.InternalServerErrorException('Failed to upload payment proof.');
        }
    }
    async getMyProfile(req) {
        try {
            const customerId = new mongoose_1.Types.ObjectId(req.user.sub);
            return await this.customerOpsService.getMyProfile(customerId);
        }
        catch (error) {
            this.logger.error('❌ Error fetching profile:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch profile.');
        }
    }
    async updateMyProfile(req, file, body) {
        this.logger.log('🟡 [updateMyProfile] Called');
        const lang = req.query.lang || 'en';
        try {
            const userId = new mongoose_1.Types.ObjectId(req.user.sub);
            return await this.customerOpsService.updateMyProfile(userId, body, file, lang);
        }
        catch (error) {
            this.logger.error('❌ [updateMyProfile] Error:', error);
            throw new common_1.InternalServerErrorException('Failed to update profile.');
        }
    }
};
exports.CustomerOperationsController = CustomerOperationsController;
__decorate([
    (0, common_1.Get)('properties'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "getPropertiesByCategory", null);
__decorate([
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)('bookings/all'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Post)('bookings/:bookingId/payment-proof'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('paymentProof', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookingId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "uploadPaymentProof", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
                return callback(new common_1.BadRequestException('Only JPG, JPEG, or PNG images are allowed!'), false);
            }
            callback(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerOperationsController.prototype, "updateMyProfile", null);
exports.CustomerOperationsController = CustomerOperationsController = CustomerOperationsController_1 = __decorate([
    (0, common_1.Controller)('customer'),
    (0, common_1.UseGuards)(customerAuthGuard_1.CustomerJwtAuthGuard),
    __metadata("design:paramtypes", [operation_customer_service_1.CustomerOperationsService])
], CustomerOperationsController);
//# sourceMappingURL=operation-customer.controller.js.map