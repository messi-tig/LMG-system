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
var CustomerOperationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerOperationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nestjs_i18n_1 = require("nestjs-i18n");
const property_schema_1 = require("../property/property.schema");
const booking_schema_1 = require("../booking/booking.schema");
const user_schema_1 = require("../schema/user.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let CustomerOperationsService = CustomerOperationsService_1 = class CustomerOperationsService {
    assetModel;
    bookingModel;
    userModel;
    i18n;
    cloudinaryService;
    logger = new common_1.Logger(CustomerOperationsService_1.name);
    constructor(assetModel, bookingModel, userModel, i18n, cloudinaryService) {
        this.assetModel = assetModel;
        this.bookingModel = bookingModel;
        this.userModel = userModel;
        this.i18n = i18n;
        this.cloudinaryService = cloudinaryService;
    }
    async getPropertiesByCategory(category, lang) {
        try {
            const query = { category };
            const assets = await this.assetModel
                .find(query)
                .populate('merchant', 'fullName email phonenumber businessName')
                .populate('booking', 'startDate endDate numberOfProperty')
                .lean()
                .exec();
            if (!assets.length) {
                throw new common_1.NotFoundException(await this.i18n.translate('customer-operation.ERROR_NO_PROPERTY_FOUND', { lang }));
            }
            return {
                message: await this.i18n.translate('customer-operation.SUCCESS_PROPERTY_FETCHED', { lang }),
                category,
                totalProperties: assets.length,
                properties: assets.map((asset) => {
                    const merchant = asset.merchant;
                    const booking = asset.booking;
                    return {
                        name: asset.name,
                        description: asset.description,
                        category: asset.category,
                        priceUnit: asset.priceUnit,
                        numberOfProperty: asset.numberOfProperty,
                        status: asset.status,
                        imageUrls: asset.imageUrls || [],
                        rentalPrice: {
                            perHour: asset.rentalPriceperhour,
                            perDay: asset.rentalPriceperday,
                            perMonth: asset.rentalPricepermonth,
                            perYear: asset.rentalPriceperyear,
                        },
                        merchant: {
                            name: merchant?.fullName || 'N/A',
                            acountnumber: merchant?.acountnumber,
                            email: merchant?.email || 'N/A',
                            phone: merchant?.phonenumber || 'N/A',
                            businessName: merchant?.businessName || 'N/A',
                        },
                        bookingDetails: booking
                            ? {
                                startDate: booking.startDate,
                                endDate: booking.endDate,
                                numberOfProperty: booking.numberOfProperty,
                            }
                            : null,
                    };
                }),
            };
        }
        catch (error) {
            console.error('❌ Error fetching properties:', error);
            throw new common_1.InternalServerErrorException(await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }));
        }
    }
    async getMyBookings(customerId, lang) {
        try {
            const bookings = await this.bookingModel
                .find({ customer: customerId })
                .populate('asset', 'name category numberOfProperty imageUrls')
                .populate('merchant', 'fullName email phonenumber businessName')
                .populate('customer', 'fullName email phonenumber')
                .lean()
                .exec();
            if (!bookings.length) {
                throw new common_1.NotFoundException(await this.i18n.translate('customer-operation.ERROR_NO_BOOKING_FOUND', { lang }));
            }
            return {
                message: await this.i18n.translate('customer-operation.SUCCESS_BOOKINGS_FETCHED', { lang }),
                totalBookings: bookings.length,
                bookings: bookings.map((booking) => {
                    const asset = booking.asset;
                    const merchant = booking.merchant;
                    const customer = booking.customer;
                    return {
                        bookingId: booking._id,
                        assetName: asset?.name || 'N/A',
                        category: asset?.category || 'N/A',
                        numberOfProperty: booking?.numberOfProperty || 0,
                        imageUrls: asset?.imageUrls || [],
                        priceUnit: booking?.timeInterval || 'N/A',
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        totalPrice: booking.totalPrice,
                        status: booking.status,
                        paymentProofPath: booking.paymentProofPath || null,
                        merchant: {
                            name: merchant?.fullName || 'N/A',
                            email: merchant?.email || 'N/A',
                            phone: merchant?.phonenumber || 'N/A',
                            businessName: merchant?.businessName || 'N/A',
                        },
                        bookedBy: {
                            name: customer?.fullName || 'N/A',
                            email: customer?.email || 'N/A',
                            phone: customer?.phonenumber || 'N/A',
                        },
                    };
                }),
            };
        }
        catch (error) {
            console.error('❌ Error fetching bookings:', error);
            throw new common_1.InternalServerErrorException(await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }));
        }
    }
    async getAllBookings(lang) {
        try {
            const bookings = await this.bookingModel
                .find()
                .populate('asset', 'name category numberOfProperty imageUrls')
                .populate('merchant', 'email fullName businessName phonenumber')
                .lean()
                .exec();
            if (!bookings.length) {
                throw new common_1.NotFoundException(await this.i18n.translate('customer-operation.ERROR_NO_BOOKING_FOUND', { lang }));
            }
            return {
                message: await this.i18n.translate('customer-operation.SUCCESS_BOOKINGS_FETCHED', { lang }),
                totalBookings: bookings.length,
                bookings: bookings.map((booking) => {
                    const asset = booking.asset;
                    const merchant = booking.merchant;
                    return {
                        propertyName: asset?.name || 'N/A',
                        numberOfProperty: booking?.numberOfProperty || 0,
                        merchantEmail: merchant?.email || 'N/A',
                        merchantPhone: merchant?.phonenumber || 'N/A',
                        businessName: merchant?.businessName || 'N/A',
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        paymentProofPath: booking.paymentProofPath || "no payment proven",
                        imageUrls: asset?.imageUrls || [],
                    };
                }),
            };
        }
        catch (error) {
            console.error('❌ Error fetching all bookings:', error);
            throw new common_1.InternalServerErrorException(await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }));
        }
    }
    async uploadToCloudinary(file, folder) {
        if (!file?.buffer) {
            this.logger.warn('⚠️ No file buffer provided for Cloudinary upload.');
            throw new common_1.BadRequestException('Invalid file upload.');
        }
        try {
            const url = await this.cloudinaryService.uploadImage(file, folder);
            this.logger.log(`✅ Uploaded to Cloudinary folder "${folder}"`);
            return url;
        }
        catch (err) {
            this.logger.error(`❌ Cloudinary upload failed (${folder}):`, err);
            throw new common_1.InternalServerErrorException('Image upload failed.');
        }
    }
    async uploadPaymentProof(customerId, bookingId, paymentProofFile, lang) {
        try {
            const booking = await this.bookingModel.findById(bookingId);
            if (!booking) {
                throw new common_1.NotFoundException(await this.i18n.translate('customer-operation.ERROR_BOOKING_NOT_FOUND', { lang }));
            }
            if (!booking.customer.equals(customerId)) {
                throw new common_1.ForbiddenException(await this.i18n.translate('customer-operation.ERROR_NOT_OWNER', { lang }));
            }
            if (!paymentProofFile) {
                throw new common_1.BadRequestException(await this.i18n.translate('customer-operation.ERROR_NO_FILE_UPLOADED', { lang }));
            }
            const paymentProofUrl = await this.uploadToCloudinary(paymentProofFile, 'payment-proofs');
            booking.paymentProofPath = paymentProofUrl;
            await booking.save();
            this.logger.log(`💾 Payment proof saved for booking ${bookingId}`);
            return {
                statusCode: 200,
                message: await this.i18n.translate('customer-operation.SUCCESS_PAYMENT_PROOF_UPLOADED', { lang }),
                paymentProofUrl,
            };
        }
        catch (error) {
            this.logger.error('❌ Error uploading payment proof:', error);
            throw new common_1.InternalServerErrorException(await this.i18n.translate('customer-operation.ERROR_UPLOAD_FAILED', { lang }));
        }
    }
    async getMyProfile(customerId) {
        console.log('🟢 [Service:getMyProfile] Called with customerId:', customerId);
        try {
            const customer = await this.userModel
                .findById(customerId);
            if (!customer) {
                console.warn('⚠️ [Service:getMyProfile] No customer found for ID:', customerId);
                throw new common_1.NotFoundException('Customer not found.');
            }
            console.log('✅ [Service:getMyProfile] Customer found:', {
                id: customer._id,
                email: customer.email,
                fullName: customer.fullName,
            });
            return customer;
        }
        catch (err) {
            console.error('❌ [Service:getMyProfile] Error:', err);
            throw err;
        }
    }
    async updateMyProfile(customerId, updateData, profileImageFile, lang) {
        this.logger.debug(`🟡 Updating profile for customer ${customerId}`);
        try {
            const allowedFields = ['fullName', 'email', 'phonenumber', 'address'];
            const filteredUpdate = {};
            for (const key of Object.keys(updateData)) {
                if (allowedFields.includes(key)) {
                    filteredUpdate[key] = updateData[key];
                }
            }
            if (profileImageFile) {
                const profileImageUrl = await this.uploadToCloudinary(profileImageFile, 'profile-pictures');
                filteredUpdate.profileImage = profileImageUrl;
            }
            const customer = await this.userModel.findByIdAndUpdate(customerId, { $set: filteredUpdate }, { new: true });
            if (!customer) {
                throw new common_1.NotFoundException(await this.i18n.translate('customer-operation.ERROR_CUSTOMER_NOT_FOUND', { lang }));
            }
            this.logger.log(`✅ Profile updated for customer ${customer._id}`);
            return {
                message: await this.i18n.translate('customer-operation.SUCCESS_PROFILE_UPDATED', { lang }),
                updatedCustomer: {
                    id: customer._id,
                    fullName: customer.fullName,
                    email: customer.email,
                    phonenumber: customer.phonenumber,
                    profileImage: customer.profilePictureUrl || null,
                },
            };
        }
        catch (err) {
            this.logger.error('❌ Error updating profile:', err);
            throw new common_1.InternalServerErrorException(await this.i18n.translate('customer-operation.ERROR_UPDATE_FAILED', { lang }));
        }
    }
};
exports.CustomerOperationsService = CustomerOperationsService;
exports.CustomerOperationsService = CustomerOperationsService = CustomerOperationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Asset.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        nestjs_i18n_1.I18nService,
        cloudinary_service_1.CloudinaryService])
], CustomerOperationsService);
//# sourceMappingURL=operation-customer.service.js.map