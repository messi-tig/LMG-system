import { MerchantService } from '../merchant/merchant.service';
import { ConfigService } from '@nestjs/config';
declare const MerchantJwtStrategy_base: new (...args: any) => any;
export declare class MerchantJwtStrategy extends MerchantJwtStrategy_base {
    private readonly merchantService;
    private readonly configService;
    constructor(merchantService: MerchantService, configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
