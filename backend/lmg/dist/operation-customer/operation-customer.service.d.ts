import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { AssetDocument } from '../property/property.schema';
import { BookingDocument } from '../booking/booking.schema';
import { User, UserDocument } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class CustomerOperationsService {
    private readonly assetModel;
    private readonly bookingModel;
    private readonly userModel;
    private readonly i18n;
    private readonly cloudinaryService;
    private readonly logger;
    constructor(assetModel: Model<AssetDocument>, bookingModel: Model<BookingDocument>, userModel: Model<UserDocument>, i18n: I18nService, cloudinaryService: CloudinaryService);
    getPropertiesByCategory(category: string, lang?: string): Promise<{
        message: string;
        category: string;
        totalProperties: number;
        properties: {
            name: string;
            description: string;
            category: import("../property/property.schema").AssetCategory;
            priceUnit: string;
            numberOfProperty: number;
            status: import("../property/property.schema").AssetStatus;
            imageUrls: string[];
            rentalPrice: {
                perHour: number;
                perDay: number;
                perMonth: number;
                perYear: number;
            };
            merchant: {
                name: any;
                acountnumber: any;
                email: any;
                phone: any;
                businessName: any;
            };
            bookingDetails: {
                startDate: any;
                endDate: any;
                numberOfProperty: any;
            } | null;
        }[];
    }>;
    getMyBookings(customerId: Types.ObjectId, lang: string): Promise<{
        message: string;
        totalBookings: number;
        bookings: {
            bookingId: import("mongoose").FlattenMaps<unknown>;
            assetName: any;
            category: any;
            numberOfProperty: number;
            imageUrls: any;
            priceUnit: import("../booking/booking.schema").TimeInterval;
            startDate: Date;
            endDate: Date;
            totalPrice: number;
            status: import("../booking/booking.schema").BookingStatus;
            paymentProofPath: string | null;
            merchant: {
                name: any;
                email: any;
                phone: any;
                businessName: any;
            };
            bookedBy: {
                name: any;
                email: any;
                phone: any;
            };
        }[];
    }>;
    getAllBookings(lang: string): Promise<{
        message: string;
        totalBookings: number;
        bookings: {
            propertyName: any;
            numberOfProperty: number;
            merchantEmail: any;
            merchantPhone: any;
            businessName: any;
            startDate: Date;
            endDate: Date;
            paymentProofPath: string;
            imageUrls: any;
        }[];
    }>;
    private uploadToCloudinary;
    uploadPaymentProof(customerId: Types.ObjectId, bookingId: Types.ObjectId, paymentProofFile: Express.Multer.File, lang?: string): Promise<{
        statusCode: number;
        message: string;
        paymentProofUrl: string;
    }>;
    getMyProfile(customerId: Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateMyProfile(customerId: Types.ObjectId, updateData: any, profileImageFile?: Express.Multer.File, lang?: string): Promise<{
        message: string;
        updatedCustomer: {
            id: Types.ObjectId;
            fullName: string;
            email: string;
            phonenumber: number;
            profileImage: string | null;
        };
    }>;
}
