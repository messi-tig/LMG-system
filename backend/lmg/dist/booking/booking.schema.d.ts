import { Document, Types } from 'mongoose';
export declare enum BookingStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}
export declare enum TimeInterval {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
export type BookingDocument = Booking & Document;
export declare class Booking {
    customer: Types.ObjectId;
    merchant: Types.ObjectId;
    asset: Types.ObjectId;
    startDate: Date;
    paymentProofPath?: string;
    endDate: Date;
    timeInterval: TimeInterval;
    numberOfProperty: number;
    numberOfUnits: number;
    totalPrice: number;
    securityDeposit: number;
    status: BookingStatus;
    externalPaymentRef?: string;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Booking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
