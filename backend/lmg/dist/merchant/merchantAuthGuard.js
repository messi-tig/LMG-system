"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_schema_1 = require("../schema/user.schema");
let MerchantJwtAuthGuard = class MerchantJwtAuthGuard extends (0, passport_1.AuthGuard)('merchant-jwt') {
    handleRequest(err, user, info, context, status) {
        if (err || !user) {
            if (info && info.message === 'jwt expired') {
                throw new common_1.UnauthorizedException('Token expired');
            }
            console.log("invalid token", err);
            throw new common_1.UnauthorizedException('Invalid token');
        }
        if (!(user instanceof Object) || !('role' in user) || user.role !== user_schema_1.UserRole.MERCHANT) {
            throw new common_1.ForbiddenException('Unauthorized access');
        }
        return user;
    }
    canActivate(context) {
        return super.canActivate(context);
    }
    getRequest(context) {
        const request = context.switchToHttp().getRequest();
        return request;
    }
};
exports.MerchantJwtAuthGuard = MerchantJwtAuthGuard;
exports.MerchantJwtAuthGuard = MerchantJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], MerchantJwtAuthGuard);
//# sourceMappingURL=merchantAuthGuard.js.map