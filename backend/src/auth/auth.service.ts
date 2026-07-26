import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RegisterAuthDto,
  LoginAuthDto,
  LogoutAuthDto,
  MeAuthDto,
  RefreshAuthDto,
  VerifyOTPAuthDto,
  SendPasswordResetMailAuthDto,
  ResetPasswordAuthDto,
  ResendOTP,
} from './dto/auth.request.dto';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { comparePassword, hashPassword } from '../common/utils/hash.util';
import { generateToken, verifyToken } from '../common/utils/token.util';
import { ConfigService } from '@nestjs/config';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import type {
  RegisterResponseData,
  LoginResponseData,
  MeResponseData,
  RefreshAuthData,
} from './interfaces/auth-response.interface';
import {
  toLoginDto,
  toRegisterDto,
  toMeDto,
} from './mapper/auth-response.mapper';
import { TokenPayload } from './interfaces/TokenPayload.interface';
import { MailService } from '../mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private UserModel: Model<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  private getSalt(): number {
    return Number(this.configService.get<number>('SALT'));
  }
  private async generateAuthTokens(
    userId: string,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    hashedRefreshToken: string;
  }> {
    const accessTokenPayload = { userId, email };
    const refreshTokenPayload = { userId, email };

    const accessToken = generateToken(
      accessTokenPayload,
      this.configService.get<string>('JWT_ACCESS_SECRET')!,
      this.configService.get<string>('JWT_ACCESS_EXPIRY')!,
    );

    const refreshToken = generateToken(
      refreshTokenPayload,
      this.configService.get<string>('JWT_REFRESH_SECRET')!,
      this.configService.get<string>('JWT_REFRESH_EXPIRY')!,
    );

    const hashedRefreshToken = await hashPassword(refreshToken, this.getSalt());
    return {
      accessToken,
      refreshToken,
      hashedRefreshToken,
    };
  }

  async me(dto: MeAuthDto): Promise<ServiceResponse<MeResponseData>> {
    const user = await this.UserModel.findById(dto.userId);
    if (!user) throw new UnauthorizedException('Invalid session');

    return {
      message: 'User found',
      data: {
        user: toMeDto(user),
      },
    };
  }

  async register(
    dto: RegisterAuthDto,
  ): Promise<ServiceResponse<RegisterResponseData>> {
    const hashedPassword = await hashPassword(dto.password, this.getSalt());
    try {
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      const createdUser = await this.UserModel.create({
        ...dto,
        password: hashedPassword,
      });
      const hashedOTP = await hashPassword(OTP, this.getSalt());
      // createdUser.verificationId = hashedOTP;
      // createdUser.verificationIdExpiry = new Date(Date.now() + 10 * 60 * 1000);
      const cacheKey = `reg-otp-${createdUser.email}`;
      await this.cacheManager.set(cacheKey, hashedOTP, 1000 * 60 * 2);

      await createdUser.save();
      await this.mailService.sendVerificationEmail(dto.email, OTP);
      return {
        message: 'otp sent successfully',
        data: { user: toRegisterDto(createdUser) },
      };
    } catch (error: any) {
      // console.log(error);
      if (error.code === 11000) {
        throw new ConflictException(error.errorResponse);
      }
      throw new InternalServerErrorException(
        error.message || 'An unexpected error occurred',
      );
    }
  }

  async login(dto: LoginAuthDto): Promise<ServiceResponse<LoginResponseData>> {
    const user = await this.UserModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const { accessToken, refreshToken, hashedRefreshToken } =
      await this.generateAuthTokens(String(user._id), user.email);

    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      message: 'Login successful',
      data: {
        user: toLoginDto(user),
        accessToken,
        refreshToken,
      },
    };
  }

  async logout(dto: LogoutAuthDto): Promise<ServiceResponse<boolean>> {
    const user = await this.UserModel.findOne(
      { _id: dto.userId },
      { refreshToken: 1 },
    );
    if (!user) throw new NotFoundException('User not found');
    if (!user.refreshToken)
      throw new UnauthorizedException('Already logged out or invalid session');

    const isMatch = await comparePassword(dto.refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid session');
    }

    user.refreshToken = '';
    await user.save();

    return {
      message: 'Logout successful',
      data: true,
    };
  }

  async ResendRegisterOTP(dto: ResendOTP): Promise<ServiceResponse<boolean>> {
    const { email } = dto;
    try {
      const user = await this.UserModel.findOne({ email: email });
      if (!user) throw new NotFoundException('User Does not exist');
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = await hashPassword(OTP, this.getSalt());
      const cacheKey = `reg-otp-${email}`;
      await this.cacheManager.set(cacheKey, hashedOTP, 1000 * 60 * 2);
      await this.mailService.sendVerificationEmail(email, OTP);
      return {
        message: 'otp sent successfully',
        data: true,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.messsage || 'Unexpected error occured',
      );
    }
  }

  async refresh(
    dto: RefreshAuthDto,
  ): Promise<ServiceResponse<RefreshAuthData>> {
    const REFRESH_SECRET =
      this.configService.get<string>('JWT_REFRESH_SECRET')!;
    let tokenInfo: TokenPayload;
    try {
      tokenInfo = verifyToken(dto.refreshToken, REFRESH_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const { userId } = tokenInfo;
    const user = await this.UserModel.findById(userId).select(
      '_id email refreshToken',
    );
    if (!user) throw new UnauthorizedException('Invalid session');
    if (!user.refreshToken)
      throw new UnauthorizedException('Already logged out or invalid session');

    const isTokenMatching = await comparePassword(
      dto.refreshToken,
      user.refreshToken,
    );
    if (!isTokenMatching) throw new UnauthorizedException('Invalid token');

    const { accessToken, refreshToken, hashedRefreshToken } =
      await this.generateAuthTokens(String(user._id), user.email);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      message: 'Tokens refreshed successfully',
      data: { accessToken, refreshToken },
    };
  }

  async verifyRegistrationOTP(
    dto: VerifyOTPAuthDto,
  ): Promise<ServiceResponse<LoginResponseData>> {
    const { email, OTP } = dto;
    try {
      const cacheKey = `reg-otp-${email}`;
      const hashedOTP = await this.cacheManager.get(cacheKey);
      if (!hashedOTP)
        throw new UnauthorizedException('No OTP found for this user');
      const user = await this.UserModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');
      if (user.verified) throw new ConflictException('User already verified');
      const isMatch = await comparePassword(OTP, String(hashedOTP));
      if (!isMatch) throw new UnauthorizedException('Invalid OTP');

      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.generateAuthTokens(String(user._id), user.email);
      user.verified = true;
      user.refreshToken = hashedRefreshToken;
      await user.save();

      return {
        message: 'User Verified Successfully',
        data: {
          user: toLoginDto(user),
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'An unexpected error occurred',
      );
    }
  }

  async sendPasswordResetMail(
    dto: SendPasswordResetMailAuthDto,
  ): Promise<ServiceResponse<{ sent: boolean }>> {
    const { email } = dto;
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.verified === false)
      throw new UnauthorizedException('User not verified');
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hashPassword(OTP, this.getSalt());
    const cacheKey = `pas-otp-${email}`;
    await this.cacheManager.set(cacheKey, hashedOTP, 1000 * 60 * 2);
    this.mailService.sendPasswordResetEmail(email, OTP);
    return {
      message: 'otp sent successfully',
      data: { sent: true },
    };
  }

  async ResendPasswordResetOTP(
    dto: ResendOTP,
  ): Promise<ServiceResponse<boolean>> {
    const { email } = dto;
    try {
      const user = await this.UserModel.findOne({ email: email });
      if (!user) throw new NotFoundException('User Does not exist');
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = await hashPassword(OTP, this.getSalt());
      const cacheKey = `pas-otp-${email}`;
      await this.cacheManager.set(cacheKey, hashedOTP, 1000 * 60 * 2);
      await this.mailService.sendPasswordResetEmail(email, OTP);
      return {
        message: 'otp sent successfully',
        data: true,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.messsage || 'Unexpected error occured',
      );
    }
  }

  async verifyPasswordResetOTP(
    dto: VerifyOTPAuthDto,
  ): Promise<ServiceResponse<{ verified: boolean; RESET_PASS_TOKEN: string }>> {
    const { email, OTP } = dto;
    try {
      const cacheKey = `pas-otp-${email}`;
      const hashedOTP = await this.cacheManager.get(cacheKey);
      if (!hashedOTP)
        throw new UnauthorizedException('No OTP found for this user ');
      const user = await this.UserModel.findOne({ email });
      if (!user) throw new NotFoundException('User not found');
      if (!user.verified) throw new ConflictException('User not verified');
      const isMatch = await comparePassword(OTP, String(hashedOTP));
      if (!isMatch) throw new UnauthorizedException('Invalid OTP');
      const RESET_PASS_TOKEN = generateToken(
        { userId: String(user._id), email: user.email },
        this.configService.get<string>('JWT_RESET_PASS_SECRET')!,
        this.configService.get<string>('JWT_RESET_PASS_EXPIRY')!,
      );
      return {
        message: 'OTP verified successfully',
        data: {
          verified: true,
          RESET_PASS_TOKEN: RESET_PASS_TOKEN,
        },
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'An unexpected error occurred',
      );
    }
  }
  async ResetPassword(
    dto: ResetPasswordAuthDto,
  ): Promise<ServiceResponse<{ reset: boolean }>> {
    const { email, password } = dto;
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await hashPassword(password, this.getSalt());
    user.password = hashedPassword;
    await user.save();
    return {
      message: 'Password reset successful',
      data: { reset: true },
    };
  }
}
