import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Booking, BookingDocument } from '../booking/booking.schema';
import { Asset, AssetDocument } from '../property/property.schema';
import { UserDocument } from '../schema/user.schema';
import { BookingStatus } from '../booking/booking.schema';
export declare class MerchantOperationService {
    private readonly bookingModel;
    private readonly assetModel;
    private readonly userModel;
    private readonly i18n;
    constructor(bookingModel: Model<BookingDocument>, assetModel: Model<AssetDocument>, userModel: Model<UserDocument>, i18n: I18nService);
    getMerchantBookings(merchantId: Types.ObjectId, lang: string): Promise<{
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
    getMerchantProperties(merchantId: Types.ObjectId, lang: string): Promise<{
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
    updateProperty(merchantId: Types.ObjectId, propertyId: string, updateData: any, lang: string): Promise<{
        message: string;
        property: import("mongoose").Document<unknown, {}, AssetDocument, {}, {}> & Asset & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteProperty(merchantId: Types.ObjectId, propertyId: string, lang: string): Promise<{
        message: string;
    }>;
    updateBookingStatus(merchantId: Types.ObjectId, bookingId: string, status: BookingStatus, lang: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, {}> & Booking & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteBooking(merchantId: Types.ObjectId, bookingId: string, lang: string): Promise<{
        message: string;
    }>;
}
