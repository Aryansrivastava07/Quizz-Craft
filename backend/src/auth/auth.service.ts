import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto, LogoutAuthDto, MeAuthDto, RefreshAuthDto } from './dto/auth-request.dto';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { comparePassword, hashPassword } from '../common/utils/hash.util';
import { generateToken, verifyToken } from '../common/utils/token.util';
import { ConfigService } from '@nestjs/config';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import type { RegisterResponseData, LoginResponseData, MeResponseData, RefreshAuthData } from './interfaces/auth-response.interface';
import { toLoginDto, toRegisterDto, toMeDto } from './mapper/auth-response.mapper';
import { TokenPayload } from './interfaces/TokenPayload.interface';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    @Inject('RESEND_CLIENT')
    private UserModel: Model<User>,
    private configService: ConfigService,
    private readonly mailService: MailService
  ) { }
  private getSalt(): number {
    return Number(this.configService.get<number>('SALT'));
  }
  private async generateAuthTokens(userId: string, email: string): Promise<{ accessToken: string, refreshToken: string, hashedRefreshToken: string }> {
    const accessTokenPayload = { userId, email };
    const refreshTokenPayload = { userId, email };

    const accessToken = generateToken(
      accessTokenPayload,
      this.configService.get<string>('JWT_ACCESS_SECRET')!, this.configService.get<string>('JWT_ACCESS_EXPIRY')!
    );

    const refreshToken = generateToken(
      refreshTokenPayload,
      this.configService.get<string>('JWT_REFRESH_SECRET')!, this.configService.get<string>('JWT_REFRESH_EXPIRY')!
    );

    const hashedRefreshToken = await hashPassword(refreshToken, this.getSalt());
    return {
      accessToken,
      refreshToken,
      hashedRefreshToken
    }
  }


  async register(dto: RegisterAuthDto): Promise<ServiceResponse<RegisterResponseData>> {
    const hashedPassword = await hashPassword(dto.password, this.getSalt());
    try {
      const OTP =
        Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
      const createdUser = await this.UserModel.create({
        ...dto,
        password: hashedPassword,
      });
      const hashedOTP = await hashPassword(OTP, this.getSalt());
      createdUser.verificationId = hashedOTP;
      createdUser.verificationIdExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await createdUser.save();
      await this.mailService.sendVerificationEmail(dto.email, OTP);
      return {
        message: 'otp sent successfully',
        data: { user: toRegisterDto(createdUser) }
      };
    }
    catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException("User with this email already exists");
      }
      throw new InternalServerErrorException(error.message || 'An unexpected error occurred');
    }
  }

  async login(dto: LoginAuthDto): Promise<ServiceResponse<LoginResponseData>> {
    const user = await this.UserModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');


    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    const { accessToken, refreshToken, hashedRefreshToken } = await this.generateAuthTokens(String(user._id), user.email);

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
    const user = await this.UserModel.findOne({ _id: dto.userId }, { refreshToken: 1 });
    if (!user) throw new NotFoundException('User not found');
    if (!user.refreshToken) throw new UnauthorizedException('Already logged out or invalid session');

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

  async me(dto: MeAuthDto): Promise<ServiceResponse<MeResponseData>> {
    const user = await this.UserModel.findById(dto.userId);
    if (!user) throw new UnauthorizedException('Invalid session');

    return {
      message: 'User found',
      data: {
        user: toMeDto(user)
      }
    };
  }

  async refresh(dto: RefreshAuthDto): Promise<ServiceResponse<RefreshAuthData>> {
    const REFRESH_SECRET = this.configService.get<string>('JWT_REFRESH_SECRET')!;
    let tokenInfo: TokenPayload;
    try {
      tokenInfo = verifyToken(dto.refreshToken, REFRESH_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }


    const { userId } = tokenInfo;
    const user = await this.UserModel.findById(userId).select('_id email refreshToken');
    if (!user) throw new UnauthorizedException('Invalid session');
    if (!user.refreshToken) throw new UnauthorizedException('Already logged out or invalid session');


    const isTokenMatching = await comparePassword(dto.refreshToken, user.refreshToken);
    if (!isTokenMatching) throw new UnauthorizedException('Invalid token');

    const { accessToken, refreshToken, hashedRefreshToken } = await this.generateAuthTokens(String(user._id), user.email);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      message: "Tokens refreshed successfully",
      data: { accessToken, refreshToken }
    }
  }

  async verifyOTP(email: string, OTP: string): Promise<ServiceResponse<{ verified: boolean }>> {
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.verified) throw new ConflictException('User already verified');
    if (!user.verificationId || !user.verificationIdExpiry) throw new UnauthorizedException('No OTP found for this user');

    if (user.verificationIdExpiry < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }
    try {
      const isMatch = await comparePassword(OTP, user.verificationId);
      if (!isMatch) throw new UnauthorizedException('Invalid OTP');

      user.verified = true;
      user.verificationId = '';
      user.verificationIdExpiry = new Date(0);
      await user.save();
      return {
        message: 'User verified successfully',
        data: { verified: true }
      };
    }
    catch (error: any) {
      throw new InternalServerErrorException(error.message || 'An unexpected error occurred');
    }
  }
}