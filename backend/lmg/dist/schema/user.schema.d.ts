import { Document, Types } from 'mongoose';
export declare enum UserRole {
    ADMIN = "admin",
    MERCHANT = "merchant",
    CUSTOMER = "customer"
}
export type UserDocument = User & Document;
export declare class User {
    email: string;
    password?: string;
    phonenumber: number;
    profilePictureUrl: string;
    fullName: string;
    campanyname: string;
    address: string;
    acountnumber: number;
    role: UserRole;
    businessName: string;
    assetInventoryIds: Types.ObjectId[];
    payoutCurrency: string;
    isActive: boolean;
    lastLogin: Date;
    _id: Types.ObjectId;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class MerchantExtension {
    businessName: string;
    assetInventoryIds: Types.ObjectId[];
    payoutCurrency: string;
}
export declare class Merchant extends User {
}
export type MerchantDocument = Merchant & Document;
export declare const MerchantSchema: import("mongoose").Schema<Merchant, import("mongoose").Model<Merchant, any, any, any, Document<unknown, any, Merchant, any, {}> & Merchant & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Merchant, Document<unknown, {}, import("mongoose").FlatRecord<Merchant>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Merchant> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class CustomerExtension {
    identityVerificationStatus: string;
    lastBookingId?: Types.ObjectId;
}
export declare class Customer extends User {
    identityVerificationStatus: string;
    lastBookingId?: Types.ObjectId;
}
export type CustomerDocument = Customer & Document;
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, Document<unknown, any, Customer, any, {}> & Customer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, import("mongoose").FlatRecord<Customer>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Customer> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
