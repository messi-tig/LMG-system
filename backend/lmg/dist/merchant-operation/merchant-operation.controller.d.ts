import { MerchantOperationService } from './merchant-operation.service';
import { BookingStatus } from '../booking/booking.schema';
export declare class MerchantOperationController {
    private readonly merchantOpsService;
    constructor(merchantOpsService: MerchantOperationService);
    getMerchantBookings(req: any): Promise<{
        message: string;
        totalBookings: number;
        bookings: {
            bookingId: import("mongoose").FlattenMaps<unknown>;
            propertyName: any;
            customerName: any;
            customerEmail: any;
            customerPhone: any;
            startDate: Date;
            endDate: Date;
            totalPrice: number;
            status: BookingStatus;
            numberOfProperty: number;
            paymentProofPath: string | undefined;
        }[];
    }>;
    getMerchantProperties(req: any): Promise<{
        message: string;
        total: number;
        properties: {
            id: import("mongoose").FlattenMaps<unknown>;
            name: string;
            category: import("../property/property.schema").AssetCategory;
            description: string;
            numberOfProperty: number;
            rentalPrice: {
                perHour: number;
                perDay: number;
                perMonth: number;
                perYear: number;
            };
            imageUrls: string[];
            status: import("../property/property.schema").AssetStatus;
        }[];
    }>;
    updateProperty(req: any, id: string, body: any): Promise<{
        message: string;
        property: import("mongoose").Document<unknown, {}, import("../property/property.schema").AssetDocument, {}, {}> & import("../property/property.schema").Asset & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteProperty(req: any, id: string): Promise<{
        message: string;
    }>;
    updateBookingStatus(req: any, id: string, body: any): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("../booking/booking.schema").BookingDocument, {}, {}> & import("../booking/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteBooking(req: any, id: string): Promise<{
        message: string;
    }>;
}
