import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  TimeInterval,
} from './booking.schema';
import { PropertyService } from '../property/property.service';
import { AssetDocument, AssetStatus } from '../property/property.schema';
import {
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { User, UserDocument, UserRole } from '../schema/user.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly propertyService: PropertyService,
    private readonly i18n: I18nService,
  ) {}

  // ===================================================
  // CREATE BOOKING (Smart availability + details)
  // ===================================================
  async createBooking(
    customerId: Types.ObjectId,
    assetName: string,
    merchantEmail: string,
    startDate: Date,
    endDate: Date,
    timeInterval: TimeInterval,
    numberOfProperty: number,
    securityDeposit: number,
    lang: string,
  ) {
    console.log('📦 [BookingService] createBooking() called');

    // ✅ Find merchant
    const merchant = await this.userModel.findOne({
      email: merchantEmail,
      role: UserRole.MERCHANT,
    });

    if (!merchant)
      throw new NotFoundException(
        await this.i18n.translate('booking.ERROR_MERCHANT_NOT_FOUND', { lang }),
      );

    // ✅ Find customer
    const customer = await this.userModel.findById(customerId);
    if (!customer)
      throw new NotFoundException(
        await this.i18n.translate('booking.ERROR_CUSTOMER_NOT_FOUND', { lang }),
      );

    // ✅ Find asset owned by merchant
    const asset: AssetDocument | null = await this.propertyService['assetModel']
      .findOne({ name: assetName, merchant: merchant._id })
      .exec();

    if (!asset)
      throw new NotFoundException(
        await this.i18n.translate('booking.ERROR_ASSET_NOT_FOUND', { lang }),
      );

    if (asset.status !== AssetStatus.AVAILABLE)
      throw new BadRequestException(
        await this.i18n.translate('booking.ERROR_ASSET_UNAVAILABLE', { lang }),
      );

    // ✅ Check overlapping bookings
    const overlapping = await this.bookingModel.find({
      asset: asset._id,
      status: { $in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    const totalBooked = overlapping.reduce(
      (sum, booking) => sum + booking.numberOfProperty,
      0,
    );

    const availableUnits = asset.numberOfProperty - totalBooked;
    if (availableUnits < numberOfProperty)
      throw new BadRequestException(
        await this.i18n.translate('booking.ERROR_NOT_ENOUGH_STOCK', { lang }),
      );

    // ✅ Calculate duration based on timeInterval
    const numberOfUnits = this.calculateDuration(startDate, endDate, timeInterval, lang);

    // ✅ Calculate pricing
    const priceMap = {
      [TimeInterval.HOUR]: asset.rentalPriceperhour,
      [TimeInterval.DAY]: asset.rentalPriceperday,
      [TimeInterval.WEEK]: asset.rentalPriceperweek,
      [TimeInterval.MONTH]: asset.rentalPricepermonth,
      [TimeInterval.YEAR]: asset.rentalPriceperyear,
    };

    const pricePerUnit = priceMap[timeInterval];
    if (!pricePerUnit)
      throw new BadRequestException(
        await this.i18n.translate('booking.ERROR_INVALID_INTERVAL', { lang }),
      );

    const totalPrice = pricePerUnit * numberOfUnits * numberOfProperty;

    // ✅ Save booking
    const booking = await this.bookingModel.create({
      customer: customer._id,
      merchant: merchant._id,
      asset: asset._id,
      startDate,
      endDate,
      timeInterval,
      numberOfProperty,
      numberOfUnits,
      totalPrice,
      securityDeposit,
      status: BookingStatus.PENDING,
    });

    console.log(`✅ Booking created successfully with ID: ${booking._id}`);

    // ✅ (Optional) Send confirmation email in the future:
    // await this.mailService.sendBookingConfirmation(customer.email, merchant.email, ...);

    // ✅ Return booking summary response
    return {
      message: await this.i18n.translate('booking.SUCCESS_BOOKING_CREATED', {
        lang,
      }),
      bookingSummary: {
        bookingId: booking._id,
        assetName: asset.name,
        merchantName: merchant.businessName || merchant.fullName,
        merchantEmail: merchant.email,
        merchantPhone: merchant.phonenumber,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phonenumber,
        startDate,
        endDate,
        interval: timeInterval,
        numberOfProperty,
        numberOfUnits,
        pricePerUnit,
        totalPrice,
        availableUnitsAfterBooking: availableUnits - numberOfProperty,
        currency: asset.priceUnit,
        securityDeposit,
        status: booking.status,
        createdBy: customer.email,
      },
    };
  }

  // ===================================================
  // Helper: Duration Calculator
  // ===================================================
  private calculateDuration(
    startDate: Date,
    endDate: Date,
    timeInterval: TimeInterval,
    lang: string,
  ): number {
    switch (timeInterval) {
      case TimeInterval.HOUR:
        return Math.max(1, differenceInHours(endDate, startDate));
      case TimeInterval.DAY:
        return Math.max(1, differenceInDays(endDate, startDate));
      case TimeInterval.MONTH:
        return Math.max(1, differenceInMonths(endDate, startDate));
      case TimeInterval.YEAR:
        return Math.max(1, differenceInYears(endDate, startDate));
      default:
        throw new BadRequestException(
          this.i18n.translate('booking.ERROR_INVALID_INTERVAL', { lang }),
        );
    }
  }
}
