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
exports.CustomerSchema = exports.Customer = exports.CustomerExtension = exports.MerchantSchema = exports.Merchant = exports.MerchantExtension = exports.UserSchema = exports.User = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MERCHANT"] = "merchant";
    UserRole["CUSTOMER"] = "customer";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
    email;
    password;
    phonenumber;
    profilePictureUrl;
    fullName;
    campanyname;
    address;
    acountnumber;
    role;
    businessName;
    assetInventoryIds;
    payoutCurrency;
    isActive;
    lastLogin;
    _id;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", Number)
], User.prototype, "phonenumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "campanyname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: false, }),
    __metadata("design:type", Number)
], User.prototype, "acountnumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: Object.values(UserRole),
        default: UserRole.CUSTOMER
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Asset' }], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "assetInventoryIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'ETB' }),
    __metadata("design:type", String)
], User.prototype, "payoutCurrency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'users',
        discriminatorKey: 'role',
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
class MerchantExtension {
    businessName;
    assetInventoryIds;
    payoutCurrency;
}
exports.MerchantExtension = MerchantExtension;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MerchantExtension.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Asset' }], default: [] }),
    __metadata("design:type", Array)
], MerchantExtension.prototype, "assetInventoryIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'ETB' }),
    __metadata("design:type", String)
], MerchantExtension.prototype, "payoutCurrency", void 0);
let Merchant = class Merchant extends User {
};
exports.Merchant = Merchant;
exports.Merchant = Merchant = __decorate([
    (0, mongoose_1.Schema)()
], Merchant);
exports.MerchantSchema = mongoose_1.SchemaFactory.createForClass(Merchant);
class CustomerExtension {
    identityVerificationStatus;
    lastBookingId;
}
exports.CustomerExtension = CustomerExtension;
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending', enum: ['pending', 'verified', 'rejected'] }),
    __metadata("design:type", String)
], CustomerExtension.prototype, "identityVerificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CustomerExtension.prototype, "lastBookingId", void 0);
let Customer = class Customer extends User {
    identityVerificationStatus;
    lastBookingId;
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending', enum: ['pending', 'verified', 'rejected'] }),
    __metadata("design:type", String)
], Customer.prototype, "identityVerificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Customer.prototype, "lastBookingId", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)()
], Customer);
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
//# sourceMappingURL=user.schema.js.map