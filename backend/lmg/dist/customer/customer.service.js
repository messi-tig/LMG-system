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
var CustomerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_schema_1 = require("../schema/user.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let CustomerService = CustomerService_1 = class CustomerService {
    userModel;
    jwtService;
    i18n;
    cloudinaryService;
    logger = new common_1.Logger(CustomerService_1.name);
    constructor(userModel, jwtService, i18n, cloudinaryService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.i18n = i18n;
        this.cloudinaryService = cloudinaryService;
    }
    async register(credentials, lang) {
        this.logger.log('📥 [register] called');
        const { email, password, fullName, phonenumber, acountnumber, address, profilePictureFile, } = credentials;
        if (!email || !password || !fullName || !phonenumber || !acountnumber || !address) {
            const msg = await this.i18n.translate('customer.ERROR_REQUIRED_FIELDS', { lang });
            throw new common_1.BadRequestException(msg);
        }
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            const msg = await this.i18n.translate('customer.ERROR_EMAIL_EXISTS', { lang });
            throw new common_1.ConflictException(msg);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let profilePictureUrl = '';
        if (profilePictureFile) {
            try {
                profilePictureUrl = await this.cloudinaryService.uploadImage(profilePictureFile, 'customers');
            }
            catch (error) {
                this.logger.error('❌ Failed to upload profile picture:', error);
                throw new common_1.InternalServerErrorException('Image upload failed.');
            }
        }
        const newCustomer = await this.userModel.create({
            email,
            password: hashedPassword,
            fullName,
            phonenumber,
            acountnumber,
            address,
            profilePictureUrl,
            role: user_schema_1.UserRole.CUSTOMER,
            isActive: true,
        });
        const token = this.generateToken(newCustomer._id, newCustomer.role);
        const successMsg = await this.i18n.translate('customer.SUCCESS_REGISTER', { lang });
        this.logger.log(`✅ New customer registered: ${newCustomer.email}`);
        return {
            token,
            message: successMsg,
            customer: {
                id: newCustomer._id.toString(),
                email: newCustomer.email,
                fullName: newCustomer.fullName,
                phonenumber: newCustomer.phonenumber,
                acountnumber: newCustomer.acountnumber,
                address: newCustomer.address,
                profilePictureUrl: newCustomer.profilePictureUrl,
                role: newCustomer.role,
            },
        };
    }
    async login(credentials, lang) {
        this.logger.log('🔑 [login] called');
        const { email, password } = credentials;
        const customer = await this.userModel
            .findOne({ email, role: user_schema_1.UserRole.CUSTOMER, isActive: true })
            .select('+password')
            .exec();
        const invalidMsg = await this.i18n.translate('customer.ERROR_INVALID_CREDENTIALS', { lang });
        const inactiveMsg = await this.i18n.translate('customer.ERROR_INACTIVE_ACCOUNT', { lang });
        const successMsg = await this.i18n.translate('customer.SUCCESS_LOGIN', { lang });
        if (!customer || !customer.password) {
            this.logger.warn(`⚠️ No active customer found for email: ${email}`);
            throw new common_1.UnauthorizedException(inactiveMsg);
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            this.logger.warn(`⚠️ Invalid password for ${email}`);
            throw new common_1.UnauthorizedException(invalidMsg);
        }
        customer.lastLogin = new Date();
        await customer.save();
        const token = this.generateToken(customer._id, customer.role);
        this.logger.log(`✅ Customer login successful: ${email}`);
        return {
            token,
            message: successMsg,
            customer: {
                id: customer._id.toString(),
                email: customer.email,
                fullName: customer.fullName,
                phonenumber: customer.phonenumber,
                acountnumber: customer.acountnumber,
                address: customer.address,
                profilePictureUrl: customer.profilePictureUrl,
                role: customer.role,
            },
        };
    }
    async findById(id) {
        try {
            const objectId = new mongoose_2.Types.ObjectId(id);
            return await this.userModel.findById(objectId).exec();
        }
        catch (error) {
            this.logger.error('❌ Error fetching customer by ID:', error);
            return null;
        }
    }
    generateToken(userId, role) {
        const payload = { sub: userId, role };
        return this.jwtService.sign(payload);
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = CustomerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        nestjs_i18n_1.I18nService,
        cloudinary_service_1.CloudinaryService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map