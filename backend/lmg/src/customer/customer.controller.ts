import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Headers,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // ✅ In-memory for Cloudinary upload
import { CustomerService } from './customer.service';
import type {
  ICustomerRegistrationPayload,
  ICustomerLoginPayload,
  ICustomerLoginResponse,
} from './customer.service';

interface IRegisterBody {
  email: string;
  password: string;
  fullName: string;
  phonenumber: number;
  acountnumber: number;
  address: string;
}

@Controller('customer')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  // ===========================================================
  // 🟢 REGISTER CUSTOMER (with Cloudinary image upload)
  // ===========================================================
  @Post('register')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: memoryStorage(), // ✅ Keep file in memory for direct Cloudinary upload
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // ✅ Max 10MB
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(
    @Body() userPayload: IRegisterBody,
    @UploadedFile() file: Express.Multer.File,
    @Headers('accept-language') langHeader?: string,
  ): Promise<{ token: string; message: string; customer: any }> {
    this.logger.log('📥 [register] endpoint hit');
    const lang = langHeader || 'en';

    if (!file) {
      this.logger.error('❌ Profile picture missing');
      throw new BadRequestException('Profile picture is required.');
    }

    // ✅ Defensive: ensure address is string
    if (Array.isArray(userPayload.address)) {
      userPayload.address = userPayload.address[0];
    }

    const registrationData: ICustomerRegistrationPayload = {
      ...userPayload,
      profilePictureFile: file, // ✅ pass the file object directly
    };

    this.logger.debug(`🧾 Registration body: ${JSON.stringify(userPayload)}`);

    const result = await this.customerService.register(registrationData, lang);

    this.logger.log(`✅ Customer registered: ${result.customer.email}`);
    return result;
  }

  // ===========================================================
  // 🟡 LOGIN CUSTOMER
  // ===========================================================
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(
    @Body() userPayload: ICustomerLoginPayload,
    @Headers('accept-language') langHeader?: string,
  ): Promise<ICustomerLoginResponse> {
    this.logger.log('🔑 [login] endpoint hit');
    const lang = langHeader || 'en';

    const result = await this.customerService.login(userPayload, lang);

    this.logger.log(`✅ Login successful for: ${result.customer.email}`);
    return result;
  }
}
