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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_schema_1 = require("../schema/user.schema");
let AdminService = class AdminService {
    userModel;
    jwtService;
    i18n;
    constructor(userModel, jwtService, i18n) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.i18n = i18n;
    }
    async registerAdmin(credentials, lang) {
        const { email, password, fullName, phonenumber, address } = credentials;
        const requiredFieldsError = await this.i18n.translate('admin.ERROR_REG_REQUIRED_FIELDS', { lang });
        if (!email || !password || !fullName || !phonenumber || !address) {
            throw new common_1.BadRequestException(requiredFieldsError);
        }
        const emailExistsError = await this.i18n.translate('admin.ERROR_EMAIL_EXISTS', { lang });
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new common_1.ConflictException(emailExistsError);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await this.userModel.create({
            email,
            password: hashedPassword,
            fullName,
            phonenumber, address,
            role: user_schema_1.UserRole.ADMIN,
            isActive: true,
        });
        return newAdmin;
    }
    async login(credentials, lang) {
        const { email, password } = credentials;
        const invalidCredsOrInactive = await this.i18n.translate('admin.ERROR_INVALID_CREDENTIALS_INACTIVE', { lang });
        const invalidCredentials = await this.i18n.translate('admin.ERROR_INVALID_CREDENTIALS', { lang });
        const successLogin = await this.i18n.translate('admin.SUCCESS_LOGIN', { lang });
        const admin = await this.userModel
            .findOne({ email, role: user_schema_1.UserRole.ADMIN, isActive: true })
            .select('+password')
            .exec();
        if (!admin || !admin.password) {
            throw new common_1.UnauthorizedException(invalidCredsOrInactive);
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException(invalidCredentials);
        }
        admin.lastLogin = new Date();
        await admin.save();
        const payload = { sub: admin._id, email: admin.email, role: admin.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken,
            message: successLogin,
            admin: {
                id: admin._id.toString(),
                email: admin.email,
                fullName: admin.fullName,
                phonenumber: admin.phonenumber,
                address: admin.address,
                role: admin.role
            }
        };
    }
    generateToken(userId, role) {
        const payload = {
            sub: userId,
            role: role
        };
        return this.jwtService.sign(payload);
    }
    async findById(id) {
        console.log(`Finding manager with ID: ${id}`);
        try {
            const objectId = new mongoose_2.Types.ObjectId(id);
            return this.userModel.findById(objectId).exec();
        }
        catch (error) {
            console.error('Error converting ID to ObjectId:', error);
            return null;
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        nestjs_i18n_1.I18nService])
], AdminService);
//# sourceMappingURL=admin.service.js.map