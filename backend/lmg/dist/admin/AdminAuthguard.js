"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_schema_1 = require("../schema/user.schema");
let ManagerJwtAuthGuard = class ManagerJwtAuthGuard extends (0, passport_1.AuthGuard)('manager-jwt') {
    handleRequest(err, user, info, context, status) {
        console.log('--- ManagerJwtAuthGuard ---');
        console.log('err:', err);
        console.log('user:', user);
        console.log('info:', info);
        if (err || !user) {
            if (info && info.message === 'jwt expired') {
                console.log('Token has expired');
                throw new common_1.UnauthorizedException('Token expired');
            }
            console.log('Invalid token detected');
            throw new common_1.UnauthorizedException('Invalid token');
        }
        console.log('Checking user role...');
        if (!(user instanceof Object)) {
            console.log('User is not an object:', user);
            throw new common_1.ForbiddenException('Unauthorized access');
        }
        if (!('role' in user)) {
            console.log('Role not found in user payload:', user);
            throw new common_1.ForbiddenException('Unauthorized access');
        }
        if (user.role !== user_schema_1.UserRole.ADMIN && user.role !== 'admin') {
            console.log('User role is not admin:', user.role);
            throw new common_1.ForbiddenException('Unauthorized access');
        }
        console.log('User passed all checks:', user);
        return user;
    }
    canActivate(context) {
        console.log('ManagerJwtAuthGuard canActivate called');
        return super.canActivate(context);
    }
    getRequest(context) {
        const request = context.switchToHttp().getRequest();
        console.log('Request object:', request.headers);
        return request;
    }
};
exports.ManagerJwtAuthGuard = ManagerJwtAuthGuard;
exports.ManagerJwtAuthGuard = ManagerJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], ManagerJwtAuthGuard);
//# sourceMappingURL=AdminAuthguard.js.map