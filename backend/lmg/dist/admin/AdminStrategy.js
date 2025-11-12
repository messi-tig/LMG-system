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
exports.ManagerJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const admin_service_1 = require("./admin.service");
const config_1 = require("@nestjs/config");
let ManagerJwtStrategy = class ManagerJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "manager-jwt") {
    managerService;
    configService;
    constructor(managerService, configService) {
        const secret = configService.get('JWT_SECRET');
        console.log('🔐 [ManagerJwtStrategy] Initializing strategy...');
        console.log('🔑 JWT Secret from ConfigService:', secret ? '(loaded successfully)' : '(❌ missing!)');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
        this.managerService = managerService;
        this.configService = configService;
    }
    async validate(payload) {
        console.log('\n========== [ManagerJwtStrategy.validate] ==========');
        console.log('🧾 Full JWT Payload:', JSON.stringify(payload, null, 2));
        try {
            if (!payload) {
                console.error('❌ JWT payload is missing or undefined!');
                throw new common_1.UnauthorizedException('Invalid token: missing payload');
            }
            if (!payload.sub) {
                console.error('❌ JWT payload missing "sub" field (user ID)');
                throw new common_1.UnauthorizedException('Invalid token: missing sub');
            }
            if (!payload.role) {
                console.warn('⚠️ JWT payload missing role — expected ADMIN role.');
            }
            console.log(`🔍 Fetching admin user from DB with ID: ${payload.sub}...`);
            const user = await this.managerService.findById(payload.sub);
            if (!user) {
                console.error(`❌ No admin found in DB for ID: ${payload.sub}`);
                throw new common_1.UnauthorizedException('User not found');
            }
            console.log('✅ User found:', {
                id: user._id?.toString(),
                email: user.email,
                role: user.role,
            });
            if (!user.role || user.role !== 'admin') {
                console.error(`🚫 Unauthorized role detected: ${user.role}`);
                throw new common_1.UnauthorizedException('Unauthorized: invalid role');
            }
            const userId = typeof user._id === 'string' ? user._id : user._id.toString();
            console.log('✅ Returning validated user:', {
                id: userId,
                email: user.email,
                role: user.role,
            });
            console.log('===================================================\n');
            return {
                id: userId,
                email: user.email,
                role: user.role,
            };
        }
        catch (error) {
            console.error('💥 Error during JWT validation:', error);
            console.error('---------------------------------------------------\n');
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.ManagerJwtStrategy = ManagerJwtStrategy;
exports.ManagerJwtStrategy = ManagerJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        config_1.ConfigService])
], ManagerJwtStrategy);
//# sourceMappingURL=AdminStrategy.js.map