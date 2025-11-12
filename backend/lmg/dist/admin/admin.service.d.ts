import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { UserRole, User, UserDocument } from '../schema/user.schema';
export interface IAdminLoginResponse {
    accessToken: string;
    message: string;
    admin: {
        id: string;
        email: string;
        fullName: string;
        phonenumber: number;
        address: string;
        role: UserRole;
    };
}
interface IAdminCredentials {
    email: string;
    password: string;
    fullName?: string;
    phonenumber?: number;
    address?: string | number;
}
export declare class AdminService {
    private userModel;
    private jwtService;
    private readonly i18n;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, i18n: I18nService);
    registerAdmin(credentials: IAdminCredentials, lang: string): Promise<User>;
    login(credentials: IAdminCredentials, lang: string): Promise<IAdminLoginResponse>;
    private generateToken;
    findById(id: string): Promise<User | null>;
}
export {};
