import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';
declare const ManagerJwtStrategy_base: new (...args: any) => any;
export declare class ManagerJwtStrategy extends ManagerJwtStrategy_base {
    private readonly managerService;
    private readonly configService;
    constructor(managerService: AdminService, configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
