import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { User, UserDocument, UserRole } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export interface ICustomerRegistrationPayload {
    email: string;
    password: string;
    fullName: string;
    phonenumber: number;
    acountnumber: number;
    address: string;
    profilePictureFile?: Express.Multer.File;
}
export interface ICustomerLoginPayload {
    email: string;
    password: string;
}
export interface ICustomerLoginResponse {
    token: string;
    message: string;
    customer: {
        id: string;
        email: string;
        fullName: string;
        phonenumber: number;
        acountnumber: number;
        address: string;
        profilePictureUrl: string;
        role: UserRole;
    };
}
export declare class CustomerService {
    private readonly userModel;
    private readonly jwtService;
    private readonly i18n;
    private readonly cloudinaryService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, i18n: I18nService, cloudinaryService: CloudinaryService);
    register(credentials: ICustomerRegistrationPayload, lang: string): Promise<ICustomerLoginResponse>;
    login(credentials: ICustomerLoginPayload, lang: string): Promise<ICustomerLoginResponse>;
    findById(id: string): Promise<User | null>;
    private generateToken;
}
