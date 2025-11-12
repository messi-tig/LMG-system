"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const customerStrategy_1 = require("./customerStrategy");
const customer_module_1 = require("./customer.module");
let CustomerAuthModule = class CustomerAuthModule {
};
exports.CustomerAuthModule = CustomerAuthModule;
exports.CustomerAuthModule = CustomerAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            passport_1.PassportModule.register({ defaultStrategy: "customer-jwt", session: false }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
            customer_module_1.CustomerModule,
        ],
        providers: [customerStrategy_1.CustomerJwtStrategy],
        exports: [jwt_1.JwtModule, passport_1.PassportModule, customerStrategy_1.CustomerJwtStrategy],
    })
], CustomerAuthModule);
//# sourceMappingURL=customerAuthMoodule.js.map