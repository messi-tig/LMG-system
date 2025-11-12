import { AdminService } from './admin.service';
import { User } from '../schema/user.schema';
import { IAdminLoginResponse } from './admin.service';
interface IAdminAuthBody {
    email: string;
    password: string;
    fullName?: string;
    phonenumber: number;
    address: string;
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    login(payload: any, lang: string): Promise<IAdminLoginResponse>;
    register(payload: IAdminAuthBody, lang: string): Promise<User>;
}
export {};
