import { BookingService } from './booking.service';
import { TimeInterval } from './booking.schema';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(req: any, body: any): Promise<{
        statusCode: number;
        message: string;
        bookingSummary?: undefined;
    } | {
        statusCode: number;
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
            status: import("./booking.schema").BookingStatus;
            createdBy: string;
        };
    }>;
}
