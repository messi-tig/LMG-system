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
exports.MerchantOperationController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const merchantAuthGuard_1 = require("../merchant/merchantAuthGuard");
const merchant_operation_service_1 = require("./merchant-operation.service");
let MerchantOperationController = class MerchantOperationController {
    merchantOpsService;
    constructor(merchantOpsService) {
        this.merchantOpsService = merchantOpsService;
    }
    async getMerchantBookings(req) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        return await this.merchantOpsService.getMerchantBookings(merchantId, lang);
    }
    async getMerchantProperties(req) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        return await this.merchantOpsService.getMerchantProperties(merchantId, lang);
    }
    async updateProperty(req, id, body) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        return await this.merchantOpsService.updateProperty(merchantId, id, body, lang);
    }
    async deleteProperty(req, id) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        return await this.merchantOpsService.deleteProperty(merchantId, id, lang);
    }
    async updateBookingStatus(req, id, body) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        const { status } = body;
        return await this.merchantOpsService.updateBookingStatus(merchantId, id, status, lang);
    }
    async deleteBooking(req, id) {
        const merchantId = new mongoose_1.Types.ObjectId(req.user.sub);
        const lang = req.query.lang || 'en';
        return await this.merchantOpsService.deleteBooking(merchantId, id, lang);
    }
};
exports.MerchantOperationController = MerchantOperationController;
__decorate([
    (0, common_1.Get)('bookings'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "getMerchantBookings", null);
__decorate([
    (0, common_1.Get)('properties'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "getMerchantProperties", null);
__decorate([
    (0, common_1.Patch)('properties/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "updateProperty", null);
__decorate([
    (0, common_1.Delete)('properties/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "deleteProperty", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MerchantOperationController.prototype, "deleteBooking", null);
exports.MerchantOperationController = MerchantOperationController = __decorate([
    (0, common_1.Controller)('merchant/operations'),
    (0, common_1.UseGuards)(merchantAuthGuard_1.MerchantJwtAuthGuard),
    __metadata("design:paramtypes", [merchant_operation_service_1.MerchantOperationService])
], MerchantOperationController);
//# sourceMappingURL=merchant-operation.controller.js.map