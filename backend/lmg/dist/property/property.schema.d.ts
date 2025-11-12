import { Document, Types } from 'mongoose';
export type AssetDocument = Asset & Document;
export declare enum AssetCategory {
    EVENT_SUPPLY = "EventSupply",
    CONSTRUCTION_EQUIPMENT = "ConstructionEquipment",
    HEALTHCARE_MEDICAL = "HealthcareMedical",
    OTHER = "Other"
}
export declare enum AssetStatus {
    AVAILABLE = "available",
    RENTED = "rented",
    MAINTENANCE = "maintenance"
}
export declare class Asset {
    merchant: Types.ObjectId;
    booking?: Types.ObjectId;
    name: string;
    priceUnit: string;
    description: string;
    rentalPriceperday: number;
    rentalPriceperhour: number;
    rentalPriceperweek: number;
    rentalPricepermonth: number;
    rentalPriceperyear: number;
    category: AssetCategory;
    imageUrls: string[];
    status: AssetStatus;
    numberOfProperty: number;
}
export declare const AssetSchema: import("mongoose").Schema<Asset, import("mongoose").Model<Asset, any, any, any, Document<unknown, any, Asset, any, {}> & Asset & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Asset, Document<unknown, {}, import("mongoose").FlatRecord<Asset>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Asset> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
