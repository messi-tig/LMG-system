import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Asset } from '../property/property.schema';
import { User } from '../schema/user.schema';

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum TimeInterval {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  merchant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Asset.name, required: true })
  asset: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

@Prop({ required: false })
paymentProofPath?: string; // Local path of uploaded screenshot

  @Prop({ required: true })
  endDate: Date;

  @Prop({ enum: TimeInterval, required: true })
  timeInterval: TimeInterval;

  @Prop({ required: true, min: 1 })
  numberOfProperty: number;

  @Prop({ required: false })
  numberOfUnits: number;

  @Prop({ required:false })
  totalPrice: number;

  @Prop({ default: 0 })
  securityDeposit: number;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ default: null })
  externalPaymentRef?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
