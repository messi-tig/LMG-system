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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const customerAuthGuard_1 = require("../customer/customerAuthGuard");
const mongoose_1 = require("mongoose");
let BookingController = class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async createBooking(req, body) {
        try {
            const { assetName, merchantEmail, startDate, endDate, timeInterval, numberOfProperty, securityDeposit, lang, } = body;
            if (!assetName ||
                !merchantEmail ||
                !startDate ||
                !endDate ||
                !timeInterval ||
                !numberOfProperty) {
                return {
                    statusCode: 400,
                    message: 'Missing required booking fields',
                };
            }
            const customerId = req.user?.sub;
            if (!customerId)
                return {
                    statusCode: 401,
                    message: 'Unauthorized: missing valid customer token',
                };
            const bookingResult = await this.bookingService.createBooking(new mongoose_1.Types.ObjectId(customerId), assetName, merchantEmail, new Date(startDate), new Date(endDate), timeInterval, Number(numberOfProperty), securityDeposit ? Number(securityDeposit) : 0, lang || 'en');
            return {
                statusCode: 201,
                message: bookingResult.message,
                bookingSummary: bookingResult.bookingSummary,
            };
        }
        catch (error) {
            console.error('❌ Booking creation error:', error);
            throw error;
        }
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.UseGuards)(customerAuthGuard_1.CustomerJwtAuthGuard),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "createBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map