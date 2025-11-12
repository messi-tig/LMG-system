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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = exports.Booking = exports.TimeInterval = exports.BookingStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_schema_1 = require("../property/property.schema");
const user_schema_1 = require("../schema/user.schema");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["ACCEPTED"] = "ACCEPTED";
    BookingStatus["DECLINED"] = "DECLINED";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var TimeInterval;
(function (TimeInterval) {
    TimeInterval["HOUR"] = "hour";
    TimeInterval["DAY"] = "day";
    TimeInterval["WEEK"] = "week";
    TimeInterval["MONTH"] = "month";
    TimeInterval["YEAR"] = "year";
})(TimeInterval || (exports.TimeInterval = TimeInterval = {}));
let Booking = class Booking {
    customer;
    merchant;
    asset;
    startDate;
    paymentProofPath;
    endDate;
    timeInterval;
    numberOfProperty;
    numberOfUnits;
    totalPrice;
    securityDeposit;
    status;
    externalPaymentRef;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "merchant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: property_schema_1.Asset.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "asset", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Booking.prototype, "paymentProofPath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: TimeInterval, required: true }),
    __metadata("design:type", String)
], Booking.prototype, "timeInterval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfProperty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfUnits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "securityDeposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: BookingStatus, default: BookingStatus.PENDING }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Booking.prototype, "externalPaymentRef", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'bookings' })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map