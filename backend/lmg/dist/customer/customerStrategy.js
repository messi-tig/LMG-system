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
exports.CustomerJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const customer_service_1 = require("./customer.service");
const config_1 = require("@nestjs/config");
let CustomerJwtStrategy = class CustomerJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'customer-jwt') {
    customerService;
    configService;
    constructor(customerService, configService) {
        const secret = configService.get('JWT_SECRET');
        console.log('🔐 [CustomerJwtStrategy] Initializing...');
        console.log('🔑 JWT Secret:', secret ? '(loaded successfully)' : '(❌ missing!)');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
        this.customerService = customerService;
        this.configService = configService;
    }
    async validate(payload) {
        console.log('\n========== [CustomerJwtStrategy.validate] ==========');
        console.log('🧾 Full JWT Payload:', JSON.stringify(payload, null, 2));
        try {
            if (!payload || !payload.sub) {
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            const user = await this.customerService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('Customer not found');
            }
            if (!user.role || !['customer', 'CUSTOMER'].includes(user.role)) {
                console.error(`🚫 Unauthorized role: ${user.role}`);
                throw new common_1.UnauthorizedException('Unauthorized: not a customer');
            }
            console.log('✅ Customer validated:', {
                id: user._id?.toString(),
                email: user.email,
                role: user.role,
            });
            console.log('===================================================\n');
            return { sub: user._id.toString(), email: user.email, role: user.role };
        }
        catch (error) {
            console.error('💥 Error during JWT validation:', error);
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.CustomerJwtStrategy = CustomerJwtStrategy;
exports.CustomerJwtStrategy = CustomerJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        config_1.ConfigService])
], CustomerJwtStrategy);
//# sourceMappingURL=customerStrategy.js.map