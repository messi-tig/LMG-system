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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nestjs_i18n_1 = require("nestjs-i18n");
const booking_schema_1 = require("./booking.schema");
const property_service_1 = require("../property/property.service");
const property_schema_1 = require("../property/property.schema");
const date_fns_1 = require("date-fns");
const user_schema_1 = require("../schema/user.schema");
let BookingService = class BookingService {
    bookingModel;
    userModel;
    propertyService;
    i18n;
    constructor(bookingModel, userModel, propertyService, i18n) {
        this.bookingModel = bookingModel;
        this.userModel = userModel;
        this.propertyService = propertyService;
        this.i18n = i18n;
    }
    async createBooking(customerId, assetName, merchantEmail, startDate, endDate, timeInterval, numberOfProperty, securityDeposit, lang) {
        console.log('📦 [BookingService] createBooking() called');
        const merchant = await this.userModel.findOne({
            email: merchantEmail,
            role: user_schema_1.UserRole.MERCHANT,
        });
        if (!merchant)
            throw new common_1.NotFoundException(await this.i18n.translate('booking.ERROR_MERCHANT_NOT_FOUND', { lang }));
        const customer = await this.userModel.findById(customerId);
        if (!customer)
            throw new common_1.NotFoundException(await this.i18n.translate('booking.ERROR_CUSTOMER_NOT_FOUND', { lang }));
        const asset = await this.propertyService['assetModel']
            .findOne({ name: assetName, merchant: merchant._id })
            .exec();
        if (!asset)
            throw new common_1.NotFoundException(await this.i18n.translate('booking.ERROR_ASSET_NOT_FOUND', { lang }));
        if (asset.status !== property_schema_1.AssetStatus.AVAILABLE)
            throw new common_1.BadRequestException(await this.i18n.translate('booking.ERROR_ASSET_UNAVAILABLE', { lang }));
        const overlapping = await this.bookingModel.find({
            asset: asset._id,
            status: { $in: [booking_schema_1.BookingStatus.CONFIRMED, booking_schema_1.BookingStatus.PENDING] },
            $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
        });
        const totalBooked = overlapping.reduce((sum, booking) => sum + booking.numberOfProperty, 0);
        const availableUnits = asset.numberOfProperty - totalBooked;
        if (availableUnits < numberOfProperty)
            throw new common_1.BadRequestException(await this.i18n.translate('booking.ERROR_NOT_ENOUGH_STOCK', { lang }));
        const numberOfUnits = this.calculateDuration(startDate, endDate, timeInterval, lang);
        const priceMap = {
            [booking_schema_1.TimeInterval.HOUR]: asset.rentalPriceperhour,
            [booking_schema_1.TimeInterval.DAY]: asset.rentalPriceperday,
            [booking_schema_1.TimeInterval.WEEK]: asset.rentalPriceperweek,
            [booking_schema_1.TimeInterval.MONTH]: asset.rentalPricepermonth,
            [booking_schema_1.TimeInterval.YEAR]: asset.rentalPriceperyear,
        };
        const pricePerUnit = priceMap[timeInterval];
        if (!pricePerUnit)
            throw new common_1.BadRequestException(await this.i18n.translate('booking.ERROR_INVALID_INTERVAL', { lang }));
        const totalPrice = pricePerUnit * numberOfUnits * numberOfProperty;
        const booking = await this.bookingModel.create({
            customer: customer._id,
            merchant: merchant._id,
            asset: asset._id,
            startDate,
            endDate,
            timeInterval,
            numberOfProperty,
            numberOfUnits,
            totalPrice,
            securityDeposit,
            status: booking_schema_1.BookingStatus.PENDING,
        });
        console.log(`✅ Booking created successfully with ID: ${booking._id}`);
        return {
            message: await this.i18n.translate('booking.SUCCESS_BOOKING_CREATED', {
                lang,
            }),
            bookingSummary: {
                bookingId: booking._id,
                assetName: asset.name,
                merchantName: merchant.businessName || merchant.fullName,
                merchantEmail: merchant.email,
                merchantPhone: merchant.phonenumber,
                customerName: customer.fullName,
                customerEmail: customer.email,
                customerPhone: customer.phonenumber,
                startDate,
                endDate,
                interval: timeInterval,
                numberOfProperty,
                numberOfUnits,
                pricePerUnit,
                totalPrice,
                availableUnitsAfterBooking: availableUnits - numberOfProperty,
                currency: asset.priceUnit,
                securityDeposit,
                status: booking.status,
                createdBy: customer.email,
            },
        };
    }
    calculateDuration(startDate, endDate, timeInterval, lang) {
        switch (timeInterval) {
            case booking_schema_1.TimeInterval.HOUR:
                return Math.max(1, (0, date_fns_1.differenceInHours)(endDate, startDate));
            case booking_schema_1.TimeInterval.DAY:
                return Math.max(1, (0, date_fns_1.differenceInDays)(endDate, startDate));
            case booking_schema_1.TimeInterval.MONTH:
                return Math.max(1, (0, date_fns_1.differenceInMonths)(endDate, startDate));
            case booking_schema_1.TimeInterval.YEAR:
                return Math.max(1, (0, date_fns_1.differenceInYears)(endDate, startDate));
            default:
                throw new common_1.BadRequestException(this.i18n.translate('booking.ERROR_INVALID_INTERVAL', { lang }));
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        property_service_1.PropertyService,
        nestjs_i18n_1.I18nService])
], BookingService);
//# sourceMappingURL=booking.service.js.map