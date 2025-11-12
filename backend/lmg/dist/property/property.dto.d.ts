import { AssetCategory } from './property.schema';
export declare class CreateAssetDto {
    name: string;
    description: string;
    category: AssetCategory;
    rentalPriceperday: number;
    rentalPriceperhour: number;
    rentalPriceperweek: number;
    rentalPricepermonth: number;
    rentalPriceperyear: number;
    numberOfProperty: number;
}
