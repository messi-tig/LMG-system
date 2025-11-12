import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Booking, BookingDocument } from '../booking/booking.schema';
import { Asset, AssetDocument } from '../property/property.schema';
import { User, UserDocument } from '../schema/user.schema';
import { BookingStatus } from '../booking/booking.schema';

@Injectable()
export class MerchantOperationService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<AssetDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
  ) { }

  // ===================================================
  // 1️⃣ Get all bookings for this merchant
  // ===================================================
  async getMerchantBookings(merchantId: Types.ObjectId, lang: string) {
    try {
      const bookings = await this.bookingModel
        .find({ merchant: merchantId })
        .populate('asset', 'name category priceUnit')
        .populate('customer', 'fullName email phonenumber')
        .lean();

      if (!bookings.length) {
        throw new NotFoundException(
          await this.i18n.translate('merchant-operation.ERROR_NO_BOOKINGS_FOUND', { lang }),
        );
      }

      return {
        message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKINGS_FETCHED', { lang }),
        totalBookings: bookings.length,
        bookings: bookings.map((b) => ({
          bookingId: b._id,
          propertyName: (b.asset as any)?.name,
          customerName: (b.customer as any)?.fullName,
          customerEmail: (b.customer as any)?.email,
          customerPhone: (b.customer as any)?.phonenumber,
          startDate: b.startDate,
          endDate: b.endDate,
          totalPrice: b.totalPrice,
          status: b.status,
          numberOfProperty: b.numberOfProperty,
          paymentProofPath: b.paymentProofPath
        })),
      };
    } catch (error) {
      console.error('❌ Error fetching merchant bookings:', error);
      throw new InternalServerErrorException('Failed to fetch bookings.');
    }
  }
  async getMerchantProperties(merchantId: Types.ObjectId, lang: string) {
    try {
      // 1️⃣ Get all properties owned by this merchant
      const properties = await this.assetModel
        .find({ merchant: merchantId })
        .lean();

      if (!properties.length) {
        throw new NotFoundException(
          await this.i18n.translate('merchant-operation.ERROR_NO_PROPERTY_FOUND', { lang }),
        );
      }

      // 4️⃣ Merge property info with its related booking data
      const merged = properties.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
        description: p.description,
        numberOfProperty: p.numberOfProperty,
        rentalPrice: {
          perHour: p.rentalPriceperhour,
          perDay: p.rentalPriceperday,
          perMonth: p.rentalPricepermonth,
          perYear: p.rentalPriceperyear,
        },
        imageUrls: p.imageUrls,
        status: p.status,

      }));

      // 5️⃣ Return response
      return {
        message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_FETCHED', { lang }),
        total: merged.length,
        properties: merged,
      };
    } catch (error) {
      console.error('❌ Error fetching merchant properties with bookings:', error);
      throw new InternalServerErrorException('Failed to fetch properties with bookings.');
    }
  }

  // ===================================================
  // 3️⃣ Update property
  // ===================================================
  async updateProperty(merchantId: Types.ObjectId, propertyId: string, updateData: any, lang: string) {
    const property = await this.assetModel.findOneAndUpdate(
      { _id: propertyId, merchant: merchantId },
      updateData,
      { new: true },
    );

    if (!property) {
      throw new NotFoundException(
        await this.i18n.translate('merchant-operation.ERROR_PROPERTY_NOT_FOUND', { lang }),
      );
    }

    return {
      message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_UPDATED', { lang }),
      property,
    };
  }

  // ===================================================
  // 4️⃣ Delete property
  // ===================================================
  async deleteProperty(merchantId: Types.ObjectId, propertyId: string, lang: string) {
    const deleted = await this.assetModel.findOneAndDelete({
      _id: propertyId,
      merchant: merchantId,
    });

    if (!deleted) {
      throw new NotFoundException(
        await this.i18n.translate('merchant-operation.ERROR_PROPERTY_NOT_FOUND', { lang }),
      );
    }

    return {
      message: await this.i18n.translate('merchant-operation.SUCCESS_PROPERTY_DELETED', { lang }),
    };
  }

  // ===================================================
  // 5️⃣ Update booking status (confirm, cancel, complete)
  // ===================================================
  async updateBookingStatus(merchantId: Types.ObjectId, bookingId: string, status: BookingStatus, lang: string) {
    const booking = await this.bookingModel.findOneAndUpdate(
      { _id: bookingId, merchant: merchantId },
      { status },
      { new: true },
    );

    if (!booking) {
      throw new NotFoundException(
        await this.i18n.translate('merchant-operation.ERROR_BOOKING_NOT_FOUND', { lang }),
      );
    }

    return {
      message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKING_UPDATED', { lang }),
      booking,
    };
  }

  // ===================================================
  // 6️⃣ Delete booking
  // ===================================================
  async deleteBooking(merchantId: Types.ObjectId, bookingId: string, lang: string) {
    const deleted = await this.bookingModel.findOneAndDelete({
      _id: bookingId,
      merchant: merchantId,
    });

    if (!deleted) {
      throw new NotFoundException(
        await this.i18n.translate('merchant-operation.ERROR_BOOKING_NOT_FOUND', { lang }),
      );
    }

    return {
      message: await this.i18n.translate('merchant-operation.SUCCESS_BOOKING_DELETED', { lang }),
    };
  }
}

