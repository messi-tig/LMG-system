import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { User, UserDocument, UserRole } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export interface IMerchantRegistrationPayload {
    email: string;
    password: string;
    fullName: string;
    phonenumber: number;
    acountnumber: number;
    businessName: string;
    address: string;
    profilePictureFile?: Express.Multer.File;
}
export interface IMerchantLoginPayload {
    email: string;
    password: string;
}
export interface IMerchantLoginResponse {
    token: string;
    message: string;
    merchant: {
        id: string;
        email: string;
        fullName: string;
        phonenumber: number;
        acountnumber: number;
        businessName: string;
        address: string;
        profilePictureUrl: string;
        role: UserRole;
    };
}
export declare class MerchantService {
    private readonly userModel;
    private readonly jwtService;
    private readonly i18n;
    private readonly cloudinaryService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, i18n: I18nService, cloudinaryService: CloudinaryService);
    register(credentials: IMerchantRegistrationPayload, lang: string): Promise<IMerchantLoginResponse>;
    login(credentials: IMerchantLoginPayload, lang: string): Promise<IMerchantLoginResponse>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    private generateToken;
    updateMerchant(id: string, updateData: any, file?: Express.Multer.File, lang?: string): Promise<{
        message: string;
        merchant: import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteMerchant(id: string): Promise<{
        message: string;
        deleted: import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
