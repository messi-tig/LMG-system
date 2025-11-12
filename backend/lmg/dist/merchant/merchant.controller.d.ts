import { MerchantService } from './merchant.service';
export declare class MerchantController {
    private readonly merchantService;
    private readonly logger;
    constructor(merchantService: MerchantService);
    register(body: any, file?: Express.Multer.File, lang?: string): Promise<import("./merchant.service").IMerchantLoginResponse>;
    login(body: any, lang?: string): Promise<import("./merchant.service").IMerchantLoginResponse>;
    getAllMerchants(): Promise<import("../schema/user.schema").User[]>;
    getMerchantById(id: string): Promise<import("../schema/user.schema").User>;
    updateMerchant(id: string, updateData: any, file?: Express.Multer.File, lang?: string): Promise<{
        message: string;
        merchant: import("mongoose").Document<unknown, {}, import("../schema/user.schema").UserDocument, {}, {}> & import("../schema/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteMerchant(id: string): Promise<{
        message: string;
        deleted: import("mongoose").Document<unknown, {}, import("../schema/user.schema").UserDocument, {}, {}> & import("../schema/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
