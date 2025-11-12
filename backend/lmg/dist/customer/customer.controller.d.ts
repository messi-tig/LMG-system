import { CustomerService } from './customer.service';
import type { ICustomerLoginPayload, ICustomerLoginResponse } from './customer.service';
interface IRegisterBody {
    email: string;
    password: string;
    fullName: string;
    phonenumber: number;
    acountnumber: number;
    address: string;
}
export declare class CustomerController {
    private readonly customerService;
    private readonly logger;
    constructor(customerService: CustomerService);
    register(userPayload: IRegisterBody, file: Express.Multer.File, langHeader?: string): Promise<{
        token: string;
        message: string;
        customer: any;
    }>;
    login(userPayload: ICustomerLoginPayload, langHeader?: string): Promise<ICustomerLoginResponse>;
}
export {};
