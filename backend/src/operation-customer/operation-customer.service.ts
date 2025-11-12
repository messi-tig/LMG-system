// src/customer-operations/customer-operations.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import * as streamifier from 'streamifier';

import { Asset, AssetDocument } from '../property/property.schema';
import { Booking, BookingDocument } from '../booking/booking.schema';
import { User, UserDocument } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // ✅ Correct import

@Injectable()
export class CustomerOperationsService {
  private readonly logger = new Logger(CustomerOperationsService.name);

  constructor(
    @InjectModel(Asset.name) private readonly assetModel: Model<AssetDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
    private readonly cloudinaryService: CloudinaryService, // ✅ Inject the global CloudinaryService directly
  ) {}
// ===========================================================
// 1️⃣ RETRIEVE PROPERTIES BY CATEGORY (AND MERCHANT EMAIL)
// ===========================================================
async getPropertiesByCategory(category: string, lang?: string) {
  try {
    // Create query based only on category
    const query: any = { category };

    const assets = await this.assetModel
      .find(query)
      .populate('merchant', 'fullName email phonenumber businessName')
      // 🟢 Populate booking to get startDate, endDate, numberOfProperty
      .populate('booking', 'startDate endDate numberOfProperty')
      .lean()
      .exec();

    if (!assets.length) {
      throw new NotFoundException(
        await this.i18n.translate('customer-operation.ERROR_NO_PROPERTY_FOUND', { lang }),
      );
    }

    return {
      message: await this.i18n.translate(
        'customer-operation.SUCCESS_PROPERTY_FETCHED',
        { lang },
      ),
      category,
      totalProperties: assets.length,
      properties: assets.map((asset) => {
        const merchant = asset.merchant as any;
        const booking = asset.booking as any;

        return {
          // 🧱 Basic property info
          name: asset.name,
          description: asset.description,
          category: asset.category,
          priceUnit: asset.priceUnit,
          numberOfProperty: asset.numberOfProperty,
          status: asset.status,
          imageUrls: asset.imageUrls || [],

          // 💰 Rental prices
          rentalPrice: {
            perHour: asset.rentalPriceperhour,
            perDay: asset.rentalPriceperday,
            perMonth: asset.rentalPricepermonth,
            perYear: asset.rentalPriceperyear,
          },

          // 🧍 Merchant info
          merchant: {
            name: merchant?.fullName || 'N/A',
            acountnumber:merchant?.acountnumber,
            email: merchant?.email || 'N/A',
            phone: merchant?.phonenumber || 'N/A',
            businessName: merchant?.businessName || 'N/A',
          },

          // 📅 Booking info (populated from Booking schema)
          bookingDetails: booking
            ? {
                startDate: booking.startDate,
                endDate: booking.endDate,
                numberOfProperty: booking.numberOfProperty,
              }
            : null,
        };
      }),
    };
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    throw new InternalServerErrorException(
      await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }),
    );
  }
}


  // ===========================================================
  // 2️⃣ GET BOOKINGS CREATED BY LOGGED-IN CUSTOMER
  // ===========================================================
  async getMyBookings(customerId: Types.ObjectId, lang: string) {
    try {
      const bookings = await this.bookingModel
        .find({ customer: customerId })
        .populate('asset', 'name category numberOfProperty imageUrls')
        .populate('merchant', 'fullName email phonenumber businessName')
        .populate('customer', 'fullName email phonenumber')
        .lean()
        .exec();

      if (!bookings.length) {
        throw new NotFoundException(
          await this.i18n.translate(
            'customer-operation.ERROR_NO_BOOKING_FOUND',
            { lang },
          ),
        );
      }

      return {
        message: await this.i18n.translate(
          'customer-operation.SUCCESS_BOOKINGS_FETCHED',
          { lang },
        ),
        totalBookings: bookings.length,
        bookings: bookings.map((booking) => {
          const asset = booking.asset as any;
          const merchant = booking.merchant as any;
          const customer = booking.customer as any;
          return {
            bookingId: booking._id,
            assetName: asset?.name || 'N/A',
            category: asset?.category || 'N/A',
            numberOfProperty: booking?.numberOfProperty || 0,
            imageUrls: asset?.imageUrls || [],
            priceUnit: booking?.timeInterval || 'N/A',
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentProofPath: booking.paymentProofPath || null, // 👈 Added
            merchant: {
              name: merchant?.fullName || 'N/A',
              email: merchant?.email || 'N/A',
              phone: merchant?.phonenumber || 'N/A',
              businessName: merchant?.businessName || 'N/A',
            },
            bookedBy: {
              name: customer?.fullName || 'N/A',
              email: customer?.email || 'N/A',
              phone: customer?.phonenumber || 'N/A',
            },
          };
        }),
      };
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      throw new InternalServerErrorException(
        await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }),
      );
    }
  }

  // ===========================================================
  // 3️⃣ GET ALL BOOKINGS (VISIBLE TO ALL LOGGED-IN CUSTOMERS)
  // ===========================================================
  async getAllBookings(lang: string) {
    try {
      const bookings = await this.bookingModel
        .find()
        .populate('asset', 'name category numberOfProperty imageUrls')
        .populate('merchant', 'email fullName businessName phonenumber')
        .lean()
        .exec();

      if (!bookings.length) {
        throw new NotFoundException(
          await this.i18n.translate(
            'customer-operation.ERROR_NO_BOOKING_FOUND',
            { lang },
          ),
        );
      }

      return {
        message: await this.i18n.translate(
          'customer-operation.SUCCESS_BOOKINGS_FETCHED',
          { lang },
        ),
        totalBookings: bookings.length,
        bookings: bookings.map((booking) => {
          const asset = booking.asset as any;
          const merchant = booking.merchant as any;
          return {
            propertyName: asset?.name || 'N/A',
            numberOfProperty: booking?.numberOfProperty || 0,
            merchantEmail: merchant?.email || 'N/A',
            merchantPhone: merchant?.phonenumber || 'N/A',
            businessName: merchant?.businessName || 'N/A',
            startDate: booking.startDate,
            endDate: booking.endDate,
            paymentProofPath:booking.paymentProofPath ||"no payment proven",
            imageUrls: asset?.imageUrls || [],
          };
        }),
      };
    } catch (error) {
      console.error('❌ Error fetching all bookings:', error);
      throw new InternalServerErrorException(
        await this.i18n.translate('customer-operation.ERROR_INTERNAL', { lang }),
      );
    }
  } // 🧩 Helper — Upload any image to Cloudinary (Reusable)
  // ===========================================================
  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
  if (!file?.buffer) {
    this.logger.warn('⚠️ No file buffer provided for Cloudinary upload.');
    throw new BadRequestException('Invalid file upload.');
  }

  try {
    const url = await this.cloudinaryService.uploadImage(file, folder); // ✅ use the global CloudinaryService
    this.logger.log(`✅ Uploaded to Cloudinary folder "${folder}"`);
    return url;
  } catch (err) {
    this.logger.error(`❌ Cloudinary upload failed (${folder}):`, err);
    throw new InternalServerErrorException('Image upload failed.');
  }
}

  // ===========================================================
  // 4️⃣ UPLOAD PAYMENT PROOF (Improved)
  // ===========================================================
  async uploadPaymentProof(
    customerId: Types.ObjectId,
    bookingId: Types.ObjectId,
    paymentProofFile: Express.Multer.File,
    lang?: string,
  ) {
    try {
      const booking = await this.bookingModel.findById(bookingId);
      if (!booking) {
        throw new NotFoundException(
          await this.i18n.translate('customer-operation.ERROR_BOOKING_NOT_FOUND', { lang }),
        );
      }

      if (!booking.customer.equals(customerId)) {
        throw new ForbiddenException(
          await this.i18n.translate('customer-operation.ERROR_NOT_OWNER', { lang }),
        );
      }

      if (!paymentProofFile) {
        throw new BadRequestException(
          await this.i18n.translate('customer-operation.ERROR_NO_FILE_UPLOADED', { lang }),
        );
      }

      // ✅ Upload to Cloudinary (reusable helper)
      const paymentProofUrl = await this.uploadToCloudinary(
        paymentProofFile,
        'payment-proofs',
      );

      // ✅ Save the URL in the database
      booking.paymentProofPath = paymentProofUrl;
      await booking.save();

      this.logger.log(`💾 Payment proof saved for booking ${bookingId}`);

      return {
        statusCode: 200,
        message: await this.i18n.translate(
          'customer-operation.SUCCESS_PAYMENT_PROOF_UPLOADED',
          { lang },
        ),
        paymentProofUrl,
      };
    } catch (error) {
      this.logger.error('❌ Error uploading payment proof:', error);
      throw new InternalServerErrorException(
        await this.i18n.translate('customer-operation.ERROR_UPLOAD_FAILED', { lang }),
      );
    }
  }

// ===========================================================
// 5️⃣ GET LOGGED-IN CUSTOMER PROFILE
// ===========================================================
async getMyProfile(customerId: Types.ObjectId) {
  console.log('🟢 [Service:getMyProfile] Called with customerId:', customerId);

  try {
    const customer = await this.userModel
      .findById(customerId)

    if (!customer) {
      console.warn('⚠️ [Service:getMyProfile] No customer found for ID:', customerId);
      throw new NotFoundException('Customer not found.');
    }

    console.log('✅ [Service:getMyProfile] Customer found:', {
      id: customer._id,
      email: customer.email,
      fullName: customer.fullName,
    });

    return customer;
  } catch (err) {
    console.error('❌ [Service:getMyProfile] Error:', err);
    throw err;
  }
} // ===========================================================
  // 6️⃣ UPDATE LOGGED-IN CUSTOMER PROFILE (Improved Upload)
  // ===========================================================
  async updateMyProfile(
    customerId: Types.ObjectId,
    updateData: any,
    profileImageFile?: Express.Multer.File,
    lang?: string,
  ) {
    this.logger.debug(`🟡 Updating profile for customer ${customerId}`);

    try {
      // ✅ Only allow specific fields to be updated
      const allowedFields = ['fullName', 'email', 'phonenumber', 'address'];
      const filteredUpdate: Record<string, any> = {};

      for (const key of Object.keys(updateData)) {
        if (allowedFields.includes(key)) {
          filteredUpdate[key] = updateData[key];
        }
      }

      // ✅ Upload new profile image (if provided)
      if (profileImageFile) {
        const profileImageUrl = await this.uploadToCloudinary(
          profileImageFile,
          'profile-pictures',
        );
        filteredUpdate.profileImage = profileImageUrl;
      }

      const customer = await this.userModel.findByIdAndUpdate(
        customerId,
        { $set: filteredUpdate },
        { new: true },
      );

      if (!customer) {
        throw new NotFoundException(
          await this.i18n.translate('customer-operation.ERROR_CUSTOMER_NOT_FOUND', { lang }),
        );
      }

      this.logger.log(`✅ Profile updated for customer ${customer._id}`);

      return {
        message: await this.i18n.translate(
          'customer-operation.SUCCESS_PROFILE_UPDATED',
          { lang },
        ),
        updatedCustomer: {
          id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phonenumber: customer.phonenumber,
          profileImage: customer.profilePictureUrl|| null,
        },
      };
    } catch (err) {
      this.logger.error('❌ Error updating profile:', err);
      throw new InternalServerErrorException(
        await this.i18n.translate('customer-operation.ERROR_UPDATE_FAILED', { lang }),
      );
    }
  }
}

