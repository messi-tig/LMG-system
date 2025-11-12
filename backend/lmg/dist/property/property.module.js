"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const property_controller_1 = require("./property.controller");
const property_service_1 = require("./property.service");
const MerchantAuthmodule_1 = require("../merchant/MerchantAuthmodule");
const property_schema_1 = require("./property.schema");
const user_schema_1 = require("../schema/user.schema");
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: property_schema_1.Asset.name, schema: property_schema_1.AssetSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'JWT_SECRET',
                signOptions: { expiresIn: '1h' },
            }),
            MerchantAuthmodule_1.MerchantAuthModule,
        ],
        controllers: [property_controller_1.PropertyController],
        providers: [
            property_service_1.PropertyService,
        ],
        exports: [property_service_1.PropertyService],
    })
], PropertyModule);
//# sourceMappingURL=property.module.js.map