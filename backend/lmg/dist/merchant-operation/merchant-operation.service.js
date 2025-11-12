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
exports.MerchantOperationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nestjs_i18n_1 = require("nestjs-i18n");
const booking_schema_1 = require("../booking/booking.schema");
const property_schema_1 = require("../property/property.schema");
const user_schema_1 = require("../schema/user.schema");
let MerchantOperationService = class MerchantOperationService {
    bookingModel;
    assetModel;
    userModel;
    i18n;
    constructor(bookingModel, assetModel, userModel, i18n) {
        this.bookingModel = bookingModel;
        this.assetModel = assetModel;
        this.userModel = userModel;
        this.i18n = i18n;
    }
    async getMerchantBookings(merchantId, lang) {
        try {
            const bookings = await this.bookingModel
                .find({ merchant: merchantId })
                .populate('asset', 'name category priceUnit')
                .populate('customer', 'fullName email phonenumber')
                .lean();
            if (!bookings.length) {
                throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_NO_BOOKINGS_FOUND', { lang }));
            }
            return {
                message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKINGS_FETCHED', { lang }),
                totalBookings: bookings.length,
                bookings: bookings.map((b) => ({
                    bookingId: b._id,
                    propertyName: b.asset?.name,
                    customerName: b.customer?.fullName,
                    customerEmail: b.customer?.email,
                    customerPhone: b.customer?.phonenumber,
                    startDate: b.startDate,
                    endDate: b.endDate,
                    totalPrice: b.totalPrice,
                    status: b.status,
                    numberOfProperty: b.numberOfProperty,
                    paymentProofPath: b.paymentProofPath
                })),
            };
        }
        catch (error) {
            console.error('❌ Error fetching merchant bookings:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch bookings.');
        }
    }
    async getMerchantProperties(merchantId, lang) {
        try {
            const properties = await this.assetModel
                .find({ merchant: merchantId })
                .lean();
            if (!properties.length) {
                throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_NO_PROPERTY_FOUND', { lang }));
            }
            const merged = properties.map((p) => ({
                id: p._id,
                name: p.name,
                category: p.category,
                description: p.description,
                numberOfProperty: p.numberOfProperty,
                rentalPrice: {
                    perHour: p.rentalPriceperhour,
                    perDay: p.rentalPriceperday,
                    perMonth: p.rentalPricepermonth,
                    perYear: p.rentalPriceperyear,
                },
                imageUrls: p.imageUrls,
                status: p.status,
            }));
            return {
                message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_FETCHED', { lang }),
                total: merged.length,
                properties: merged,
            };
        }
        catch (error) {
            console.error('❌ Error fetching merchant properties with bookings:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch properties with bookings.');
        }
    }
    async updateProperty(merchantId, propertyId, updateData, lang) {
        const property = await this.assetModel.findOneAndUpdate({ _id: propertyId, merchant: merchantId }, updateData, { new: true });
        if (!property) {
            throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_PROPERTY_NOT_FOUND', { lang }));
        }
        return {
            message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_UPDATED', { lang }),
            property,
        };
    }
    async deleteProperty(merchantId, propertyId, lang) {
        const deleted = await this.assetModel.findOneAndDelete({
            _id: propertyId,
            merchant: merchantId,
        });
        if (!deleted) {
            throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_PROPERTY_NOT_FOUND', { lang }));
        }
        return {
            message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_DELETED', { lang }),
        };
    }
    async updateBookingStatus(merchantId, bookingId, status, lang) {
        const booking = await this.bookingModel.findOneAndUpdate({ _id: bookingId, merchant: merchantId }, { status }, { new: true });
        if (!booking) {
            throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_BOOKING_NOT_FOUND', { lang }));
        }
        return {
            message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKING_UPDATED', { lang }),
            booking,
        };
    }
    async deleteBooking(merchantId, bookingId, lang) {
        const deleted = await this.bookingModel.findOneAndDelete({
            _id: bookingId,
            merchant: merchantId,
        });
        if (!deleted) {
            throw new common_1.NotFoundException(await this.i18n.translate('merchant-operation.ERROR_BOOKING_NOT_FOUND', { lang }));
        }
        return {
            message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKING_DELETED', { lang }),
        };
    }
};
exports.MerchantOperationService = MerchantOperationService;
exports.MerchantOperationService = MerchantOperationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(property_schema_1.Asset.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        nestjs_i18n_1.I18nService])
], MerchantOperationService);
//# sourceMappingURL=merchant-operation.service.js.map