// src/customer-operations/operation-customer.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  InternalServerErrorException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { CustomerOperationsService } from './operation-customer.service';
import { CustomerJwtAuthGuard } from '../customer/customerAuthGuard';

@Controller('customer')
@UseGuards(CustomerJwtAuthGuard)
export class CustomerOperationsController {
  private readonly logger = new Logger(CustomerOperationsController.name);

  constructor(private readonly customerOpsService: CustomerOperationsService) {}

  // ===========================================================
  // 1️⃣ GET PROPERTIES BY CATEGORY
  // ===========================================================
  @Get('properties')
  async getPropertiesByCategory(@Query('category') category: string, @Req() req) {
    try {
      const lang = req.query.lang || 'en';
      return await this.customerOpsService.getPropertiesByCategory(category, lang);
    } catch (error) {
      this.logger.error('❌ Error fetching properties by category:', error);
      throw new InternalServerErrorException('Failed to fetch properties.');
    }
  }

  // ===========================================================
  // 2️⃣ GET BOOKINGS OF LOGGED-IN CUSTOMER
  // ===========================================================
  @Get('bookings')
  async getMyBookings(@Req() req) {
    try {
      const lang = req.query.lang || 'en';
      const customerId = new Types.ObjectId(req.user.sub);
      return await this.customerOpsService.getMyBookings(customerId, lang);
    } catch (error) {
      this.logger.error('❌ Error fetching customer bookings:', error);
      throw new InternalServerErrorException('Failed to fetch bookings.');
    }
  }

  // ===========================================================
  // 3️⃣ GET ALL BOOKINGS (VISIBLE TO ALL CUSTOMERS)
  // ===========================================================
  @Get('bookings/all')
  async getAllBookings(@Req() req) {
    try {
      const lang = req.query.lang || 'en';
      return await this.customerOpsService.getAllBookings(lang);
    } catch (error) {
      this.logger.error('❌ Error fetching all bookings:', error);
      throw new InternalServerErrorException('Failed to fetch all bookings.');
    }
  }

  // ===========================================================
  // 4️⃣ UPLOAD PAYMENT PROOF (Cloudinary handled in service)
  // ===========================================================
  @Post('bookings/:bookingId/payment-proof')
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
    }),
  )
  async uploadPaymentProof(
    @Req() req,
    @Param('bookingId') bookingId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('📤 Uploading payment proof...');
    const lang = req.query.lang || 'en';

    try {
      if (!file) {
        throw new BadRequestException('Payment proof image is required.');
      }

      const customerId = new Types.ObjectId(req.user.sub);

      // ✅ Pass file directly — Cloudinary handled in service
      return await this.customerOpsService.uploadPaymentProof(
        customerId,
        new Types.ObjectId(bookingId),
        file,
        lang,
      );
    } catch (error) {
      this.logger.error('❌ Error uploading payment proof:', error);
      throw new InternalServerErrorException('Failed to upload payment proof.');
    }
  }

  // ===========================================================
  // 5️⃣ GET LOGGED-IN CUSTOMER PROFILE
  // ===========================================================
  @Get('profile')
  async getMyProfile(@Req() req) {
    try {
      const customerId = new Types.ObjectId(req.user.sub);
      return await this.customerOpsService.getMyProfile(customerId);
    } catch (error) {
      this.logger.error('❌ Error fetching profile:', error);
      throw new InternalServerErrorException('Failed to fetch profile.');
    }
  }

  // ===========================================================
  // 6️⃣ UPDATE LOGGED-IN CUSTOMER PROFILE (Cloudinary handled in service)
  // ===========================================================
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          return callback(
            new BadRequestException('Only JPG, JPEG, or PNG images are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  )
  async updateMyProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    this.logger.log('🟡 [updateMyProfile] Called');
    const lang = req.query.lang || 'en';

    try {
      const userId = new Types.ObjectId(req.user.sub);

      // ✅ Delegate upload + update logic to service
      return await this.customerOpsService.updateMyProfile(userId, body, file, lang);
    } catch (error) {
      this.logger.error('❌ [updateMyProfile] Error:', error);
      throw new InternalServerErrorException('Failed to update profile.');
    }
  }
}
