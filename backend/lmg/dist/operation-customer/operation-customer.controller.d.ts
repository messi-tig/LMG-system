import { Types } from 'mongoose';
import { CustomerOperationsService } from './operation-customer.service';
export declare class CustomerOperationsController {
    private readonly customerOpsService;
    private readonly logger;
    constructor(customerOpsService: CustomerOperationsService);
    getPropertiesByCategory(category: string, req: any): Promise<{
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
    getMyBookings(req: any): Promise<{
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
    getAllBookings(req: any): Promise<{
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
    uploadPaymentProof(req: any, bookingId: string, file: Express.Multer.File): Promise<{
        statusCode: number;
        message: string;
        paymentProofUrl: string;
    }>;
    getMyProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schema/user.schema").UserDocument, {}, {}> & import("../schema/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateMyProfile(req: any, file: Express.Multer.File, body: any): Promise<{
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
