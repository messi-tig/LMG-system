import { CustomerService } from './customer.service';
import { ConfigService } from '@nestjs/config';
declare const CustomerJwtStrategy_base: new (...args: any) => any;
export declare class CustomerJwtStrategy extends CustomerJwtStrategy_base {
    private readonly customerService;
    private readonly configService;
    constructor(customerService: CustomerService, configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
