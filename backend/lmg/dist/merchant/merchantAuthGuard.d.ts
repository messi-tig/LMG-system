import { ExecutionContext } from '@nestjs/common';
declare const MerchantJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class MerchantJwtAuthGuard extends MerchantJwtAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import('rxjs').Observable<boolean>;
    getRequest(context: ExecutionContext): any;
}
export {};
