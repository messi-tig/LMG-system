import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { BookingDocument, BookingStatus, TimeInterval } from './booking.schema';
import { PropertyService } from '../property/property.service';
import { UserDocument } from '../schema/user.schema';
export declare class BookingService {
    private readonly bookingModel;
    private readonly userModel;
    private readonly propertyService;
    private readonly i18n;
    constructor(bookingModel: Model<BookingDocument>, userModel: Model<UserDocument>, propertyService: PropertyService, i18n: I18nService);
    createBooking(customerId: Types.ObjectId, assetName: string, merchantEmail: string, startDate: Date, endDate: Date, timeInterval: TimeInterval, numberOfProperty: number, securityDeposit: number, lang: string): Promise<{
        message: string;
        bookingSummary: {
            bookingId: unknown;
            assetName: string;
            merchantName: string;
            merchantEmail: string;
            merchantPhone: number;
            customerName: string;
            customerEmail: string;
            customerPhone: number;
            startDate: Date;
            endDate: Date;
            interval: TimeInterval;
            numberOfProperty: number;
            numberOfUnits: number;
            pricePerUnit: number;
            totalPrice: number;
            availableUnitsAfterBooking: number;
            currency: string;
            securityDeposit: number;
            status: BookingStatus;
            createdBy: string;
        };
    }>;
    private calculateDuration;
}
