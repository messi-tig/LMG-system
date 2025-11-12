"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MerchantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_schema_1 = require("../schema/user.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let MerchantService = MerchantService_1 = class MerchantService {
    userModel;
    jwtService;
    i18n;
    cloudinaryService;
    logger = new common_1.Logger(MerchantService_1.name);
    constructor(userModel, jwtService, i18n, cloudinaryService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.i18n = i18n;
        this.cloudinaryService = cloudinaryService;
    }
    async register(credentials, lang) {
        console.log('📥 [MerchantService.register] called with:', credentials);
        const { email, password, fullName, phonenumber, acountnumber, businessName, address, profilePictureFile, } = credentials;
        if (!email || !password || !fullName || !phonenumber || !acountnumber || !businessName || !address) {
            const msg = await this.i18n.translate('merchant.ERROR_REQUIRED_FIELDS', { lang });
            console.error('❌ Missing required fields for merchant registration');
            throw new common_1.BadRequestException(msg);
        }
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            const msg = await this.i18n.translate('merchant.ERROR_EMAIL_EXISTS', { lang });
            console.warn(`⚠️ Merchant already exists for email: ${email}`);
            throw new common_1.ConflictException(msg);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let profilePictureUrl = '';
        if (profilePictureFile) {
            try {
                console.log('📸 Uploading merchant profile picture...');
                profilePictureUrl = await this.cloudinaryService.uploadImage(profilePictureFile, 'merchants');
                console.log('✅ Uploaded image URL:', profilePictureUrl);
            }
            catch (error) {
                console.error('❌ Failed to upload image:', error);
                throw new common_1.InternalServerErrorException('Image upload failed.');
            }
        }
        const newMerchant = await this.userModel.create({
            email,
            password: hashedPassword,
            fullName,
            phonenumber,
            acountnumber,
            businessName,
            address,
            profilePictureUrl,
            role: user_schema_1.UserRole.MERCHANT,
            isActive: true,
        });
        console.log('✅ Merchant created:', newMerchant.email);
        const token = this.generateToken(newMerchant._id, newMerchant.role);
        const successMsg = await this.i18n.translate('merchant.SUCCESS_REGISTER', { lang });
        return {
            token,
            message: successMsg,
            merchant: {
                id: newMerchant._id.toString(),
                email: newMerchant.email,
                fullName: newMerchant.fullName,
                phonenumber: newMerchant.phonenumber,
                acountnumber: newMerchant.acountnumber,
                businessName: newMerchant.businessName,
                address: newMerchant.address,
                profilePictureUrl: newMerchant.profilePictureUrl,
                role: newMerchant.role,
            },
        };
    }
    async login(credentials, lang) {
        console.log('🔑 [MerchantService.login] called with:', credentials);
        const { email, password } = credentials;
        const merchant = await this.userModel
            .findOne({ email, role: user_schema_1.UserRole.MERCHANT, isActive: true })
            .select('+password')
            .exec();
        const invalidMsg = await this.i18n.translate('merchant.ERROR_INVALID_CREDENTIALS', { lang });
        const inactiveMsg = await this.i18n.translate('merchant.ERROR_INACTIVE_ACCOUNT', { lang });
        const successMsg = await this.i18n.translate('merchant.SUCCESS_LOGIN', { lang });
        if (!merchant || !merchant.password) {
            console.warn(`⚠️ No active merchant found for email: ${email}`);
            throw new common_1.UnauthorizedException(inactiveMsg);
        }
        const isMatch = await bcrypt.compare(password, merchant.password);
        if (!isMatch) {
            console.warn(`⚠️ Invalid password for merchant: ${email}`);
            throw new common_1.UnauthorizedException(invalidMsg);
        }
        merchant.lastLogin = new Date();
        await merchant.save();
        console.log('✅ Merchant login successful:', email);
        const token = this.generateToken(merchant._id, merchant.role);
        return {
            token,
            message: successMsg,
            merchant: {
                id: merchant._id.toString(),
                email: merchant.email,
                fullName: merchant.fullName,
                phonenumber: merchant.phonenumber,
                acountnumber: merchant.acountnumber,
                businessName: merchant.businessName,
                address: merchant.address,
                profilePictureUrl: merchant.profilePictureUrl,
                role: merchant.role,
            },
        };
    }
    async findAll() {
        console.log('📡 [MerchantService.findAll] Fetching all merchants...');
        const merchants = await this.userModel.find({ role: user_schema_1.UserRole.MERCHANT }).exec();
        console.log(`✅ Found ${merchants.length} merchants`);
        return merchants;
    }
    async findById(id) {
        console.log('📡 [MerchantService.findById] Fetching merchant ID:', id);
        const merchant = await this.userModel.findById(new mongoose_2.Types.ObjectId(id)).exec();
        if (!merchant) {
            console.error('❌ Merchant not found with ID:', id);
            throw new common_1.NotFoundException('Merchant not found.');
        }
        console.log('✅ Merchant found:', merchant.email);
        return merchant;
    }
    generateToken(userId, role) {
        const payload = { sub: userId, role };
        return this.jwtService.sign(payload);
    }
    async updateMerchant(id, updateData, file, lang) {
        this.logger.log(`✏️ Updating merchant: ${id}`);
        const merchant = await this.userModel.findById(id).exec();
        if (!merchant)
            throw new common_1.NotFoundException('Merchant not found.');
        if (file) {
            this.logger.log('☁️ Uploading new profile picture to Cloudinary...');
            const newUrl = await this.cloudinaryService.uploadImage(file, 'merchants');
            updateData.profilePictureUrl = newUrl;
        }
        Object.assign(merchant, updateData);
        await merchant.save();
        this.logger.log(`✅ Merchant updated: ${merchant.email}`);
        return { message: 'Merchant updated successfully', merchant };
    }
    async deleteMerchant(id) {
        this.logger.log(`🗑️ Deleting merchant ID: ${id}`);
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Merchant not found.');
        this.logger.log(`✅ Merchant deleted: ${result.email}`);
        return { message: 'Merchant deleted successfully', deleted: result };
    }
};
exports.MerchantService = MerchantService;
exports.MerchantService = MerchantService = MerchantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        nestjs_i18n_1.I18nService,
        cloudinary_service_1.CloudinaryService])
], MerchantService);
//# sourceMappingURL=merchant.service.js.map