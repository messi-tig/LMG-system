import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

import { User, UserDocument, UserRole } from '../schema/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

export interface ICustomerRegistrationPayload {
  email: string;
  password: string;
  fullName: string;
  phonenumber: number;
  acountnumber: number;
  address: string;
  profilePictureFile?: Express.Multer.File; // ✅ Better: actual uploaded file, not path
}

export interface ICustomerLoginPayload {
  email: string;
  password: string;
}

export interface ICustomerLoginResponse {
  token: string;
  message: string;
  customer: {
    id: string;
    email: string;
    fullName: string;
    phonenumber: number;
    acountnumber: number;
    address: string;
    profilePictureUrl: string;
    role: UserRole;
  };
}

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly cloudinaryService: CloudinaryService, // ✅ Inject globally available CloudinaryService
  ) {}

  // ===========================================================
  // 🟢 REGISTER CUSTOMER
  // ===========================================================
  async register(
    credentials: ICustomerRegistrationPayload,
    lang: string,
  ): Promise<ICustomerLoginResponse> {
    this.logger.log('📥 [register] called');
    const {
      email,
      password,
      fullName,
      phonenumber,
      acountnumber,
      address,
      profilePictureFile,
    } = credentials;

    // ✅ Basic validation
    if (!email || !password || !fullName || !phonenumber || !acountnumber || !address) {
      const msg = await this.i18n.translate('customer.ERROR_REQUIRED_FIELDS', { lang });
      throw new BadRequestException(msg);
    }

    // ✅ Check if email exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      const msg = await this.i18n.translate('customer.ERROR_EMAIL_EXISTS', { lang });
      throw new ConflictException(msg);
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Handle optional Cloudinary upload
    let profilePictureUrl = '';
    if (profilePictureFile) {
      try {
        profilePictureUrl = await this.cloudinaryService.uploadImage(profilePictureFile, 'customers');
      } catch (error) {
        this.logger.error('❌ Failed to upload profile picture:', error);
        throw new InternalServerErrorException('Image upload failed.');
      }
    }

    // ✅ Create customer
    const newCustomer = await this.userModel.create({
      email,
      password: hashedPassword,
      fullName,
      phonenumber,
      acountnumber,
      address,
      profilePictureUrl,
      role: UserRole.CUSTOMER,
      isActive: true,
    });

    const token = this.generateToken(newCustomer._id, newCustomer.role);
    const successMsg = await this.i18n.translate('customer.SUCCESS_REGISTER', { lang });

    this.logger.log(`✅ New customer registered: ${newCustomer.email}`);

    return {
      token,
      message: successMsg,
      customer: {
        id: newCustomer._id.toString(),
        email: newCustomer.email,
        fullName: newCustomer.fullName,
        phonenumber: newCustomer.phonenumber,
        acountnumber: newCustomer.acountnumber,
        address: newCustomer.address,
        profilePictureUrl: newCustomer.profilePictureUrl,
        role: newCustomer.role,
      },
    };
  }

  // ===========================================================
  // 🟡 LOGIN CUSTOMER
  // ===========================================================
  async login(
    credentials: ICustomerLoginPayload,
    lang: string,
  ): Promise<ICustomerLoginResponse> {
    this.logger.log('🔑 [login] called');
    const { email, password } = credentials;

    // ✅ Find active customer
    const customer = await this.userModel
      .findOne({ email, role: UserRole.CUSTOMER, isActive: true })
      .select('+password')
      .exec();

    const invalidMsg = await this.i18n.translate('customer.ERROR_INVALID_CREDENTIALS', { lang });
    const inactiveMsg = await this.i18n.translate('customer.ERROR_INACTIVE_ACCOUNT', { lang });
    const successMsg = await this.i18n.translate('customer.SUCCESS_LOGIN', { lang });

    if (!customer || !customer.password) {
      this.logger.warn(`⚠️ No active customer found for email: ${email}`);
      throw new UnauthorizedException(inactiveMsg);
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      this.logger.warn(`⚠️ Invalid password for ${email}`);
      throw new UnauthorizedException(invalidMsg);
    }

    // ✅ Update last login
    customer.lastLogin = new Date();
    await customer.save();

    const token = this.generateToken(customer._id, customer.role);

    this.logger.log(`✅ Customer login successful: ${email}`);

    return {
      token,
      message: successMsg,
      customer: {
        id: customer._id.toString(),
        email: customer.email,
        fullName: customer.fullName,
        phonenumber: customer.phonenumber,
        acountnumber: customer.acountnumber,
        address: customer.address,
        profilePictureUrl: customer.profilePictureUrl,
        role: customer.role,
      },
    };
  }

  // ===========================================================
  // 🟣 FIND CUSTOMER BY ID
  // ===========================================================
  async findById(id: string): Promise<User | null> {
    try {
      const objectId = new Types.ObjectId(id);
      return await this.userModel.findById(objectId).exec();
    } catch (error) {
      this.logger.error('❌ Error fetching customer by ID:', error);
      return null;
    }
  }

  // ===========================================================
  // ⚙️ PRIVATE: GENERATE TOKEN
  // ===========================================================
  private generateToken(userId: Types.ObjectId, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }
}
