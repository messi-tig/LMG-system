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
var MerchantController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const merchant_service_1 = require("./merchant.service");
const AdminAuthguard_1 = require("../admin/AdminAuthguard");
let MerchantController = MerchantController_1 = class MerchantController {
    merchantService;
    logger = new common_1.Logger(MerchantController_1.name);
    constructor(merchantService) {
        this.merchantService = merchantService;
    }
    async register(body, file, lang = 'en') {
        console.log('📤 [MerchantController.register] Incoming merchant registration request...');
        console.log('➡️ Request body:', body);
        if (file) {
            console.log('📸 Profile picture file received:', file.originalname);
        }
        else {
            console.log('⚠️ No profile picture provided.');
        }
        try {
            const result = await this.merchantService.register({ ...body, profilePictureFile: file }, lang);
            console.log('✅ [MerchantController.register] Merchant registration successful:', result.merchant?.email);
            return result;
        }
        catch (error) {
            console.error('❌ [MerchantController.register] Error during registration:', error.message);
            throw error;
        }
    }
    async login(body, lang = 'en') {
        console.log('📤 [MerchantController.login] Login attempt for:', body.email);
        try {
            const result = await this.merchantService.login(body, lang);
            console.log('✅ [MerchantController.login] Login successful for:', body.email);
            return result;
        }
        catch (error) {
            console.error('❌ [MerchantController.login] Login failed for:', body.email, '| Reason:', error.message);
            throw error;
        }
    }
    async getAllMerchants() {
        console.log('📡 [MerchantController.getAllMerchants] Fetching all merchants...');
        try {
            const merchants = await this.merchantService.findAll();
            console.log(`✅ [MerchantController.getAllMerchants] Found ${merchants.length} merchants.`);
            return merchants;
        }
        catch (error) {
            console.error('❌ [MerchantController.getAllMerchants] Failed to fetch merchants:', error.message);
            throw error;
        }
    }
    async getMerchantById(id) {
        console.log('📡 [MerchantController.getMerchantById] Fetching merchant by ID:', id);
        try {
            const merchant = await this.merchantService.findById(id);
            console.log('✅ [MerchantController.getMerchantById] Found merchant:', merchant?.email);
            return merchant;
        }
        catch (error) {
            console.error('❌ [MerchantController.getMerchantById] Error fetching merchant by ID:', id, '| Reason:', error.message);
            throw error;
        }
    }
    async updateMerchant(id, updateData, file, lang = 'en') {
        this.logger.log(`✏️ Updating merchant: ${id}`);
        return this.merchantService.updateMerchant(id, updateData, file, lang);
    }
    async deleteMerchant(id) {
        this.logger.log(`🗑️ Deleting merchant: ${id}`);
        return this.merchantService.deleteMerchant(id);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(AdminAuthguard_1.ManagerJwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePictureFile')),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(AdminAuthguard_1.ManagerJwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getAllMerchants", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMerchantById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(AdminAuthguard_1.ManagerJwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePictureFile')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Query)('lang')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateMerchant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(AdminAuthguard_1.ManagerJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "deleteMerchant", null);
exports.MerchantController = MerchantController = MerchantController_1 = __decorate([
    (0, common_1.Controller)('merchant'),
    __metadata("design:paramtypes", [merchant_service_1.MerchantService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map