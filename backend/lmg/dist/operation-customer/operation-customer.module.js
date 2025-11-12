"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationCustomerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const operation_customer_controller_1 = require("./operation-customer.controller");
const operation_customer_service_1 = require("./operation-customer.service");
const property_schema_1 = require("../property/property.schema");
const booking_schema_1 = require("../booking/booking.schema");
const user_schema_1 = require("../schema/user.schema");
const customerAuthMoodule_1 = require("../customer/customerAuthMoodule");
let OperationCustomerModule = class OperationCustomerModule {
};
exports.OperationCustomerModule = OperationCustomerModule;
exports.OperationCustomerModule = OperationCustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: property_schema_1.Asset.name, schema: property_schema_1.AssetSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            customerAuthMoodule_1.CustomerAuthModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
        ],
        controllers: [operation_customer_controller_1.CustomerOperationsController],
        providers: [operation_customer_service_1.CustomerOperationsService],
        exports: [operation_customer_service_1.CustomerOperationsService],
    })
], OperationCustomerModule);
//# sourceMappingURL=operation-customer.module.js.map