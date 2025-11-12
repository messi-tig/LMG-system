import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { AssetDocument, AssetCategory } from './property.schema';
import { UserDocument } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export interface ICreateAssetPayload {
    name: string;
    description: string;
    category: AssetCategory;
    rentalPriceperday: number;
    rentalPriceperhour: number;
    rentalPriceperweek: number;
    rentalPricepermonth: number;
    rentalPriceperyear: number;
    numberOfProperty: number;
    imageFiles: Express.Multer.File[];
}
export declare class PropertyService {
    private readonly assetModel;
    private readonly userModel;
    private readonly i18n;
    private readonly cloudinaryService;
    constructor(assetModel: Model<AssetDocument>, userModel: Model<UserDocument>, i18n: I18nService, cloudinaryService: CloudinaryService);
    createProperty(merchantId: Types.ObjectId, assetPayload: ICreateAssetPayload, lang: string): Promise<{
        message: string;
        asset: AssetDocument;
    }>;
}
