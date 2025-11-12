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
exports.AssetSchema = exports.Asset = exports.AssetStatus = exports.AssetCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schema/user.schema");
var AssetCategory;
(function (AssetCategory) {
    AssetCategory["EVENT_SUPPLY"] = "EventSupply";
    AssetCategory["CONSTRUCTION_EQUIPMENT"] = "ConstructionEquipment";
    AssetCategory["HEALTHCARE_MEDICAL"] = "HealthcareMedical";
    AssetCategory["OTHER"] = "Other";
})(AssetCategory || (exports.AssetCategory = AssetCategory = {}));
var AssetStatus;
(function (AssetStatus) {
    AssetStatus["AVAILABLE"] = "available";
    AssetStatus["RENTED"] = "rented";
    AssetStatus["MAINTENANCE"] = "maintenance";
})(AssetStatus || (exports.AssetStatus = AssetStatus = {}));
let Asset = class Asset {
    merchant;
    booking;
    name;
    priceUnit;
    description;
    rentalPriceperday;
    rentalPriceperhour;
    rentalPriceperweek;
    rentalPricepermonth;
    rentalPriceperyear;
    category;
    imageUrls;
    status;
    numberOfProperty;
};
exports.Asset = Asset;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Asset.prototype, "merchant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Asset.prototype, "booking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, trim: true }),
    __metadata("design:type", String)
], Asset.prototype, "priceUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Asset.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Asset.prototype, "rentalPriceperday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Asset.prototype, "rentalPriceperhour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Asset.prototype, "rentalPriceperweek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Asset.prototype, "rentalPricepermonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Asset.prototype, "rentalPriceperyear", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AssetCategory }),
    __metadata("design:type", String)
], Asset.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Asset.prototype, "imageUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: AssetStatus, default: AssetStatus.AVAILABLE }),
    __metadata("design:type", String)
], Asset.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 1 }),
    __metadata("design:type", Number)
], Asset.prototype, "numberOfProperty", void 0);
exports.Asset = Asset = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Asset);
exports.AssetSchema = mongoose_1.SchemaFactory.createForClass(Asset);
//# sourceMappingURL=property.schema.js.map