import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto, LoginAuthDto, LogoutAuthDto, MeAuthDto, RefreshAuthDto } from './dto/auth-request.dto';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { comparePassword, hashPassword } from '../utils/hash.util';
import { generateToken, verifyToken } from '../utils/token.util';
import { ConfigService } from '@nestjs/config';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import type { RegisterResponseData, LoginResponseData, MeResponseData, RefreshAuthData } from './interfaces/auth-response.interface';
import { toLoginDto, toRegisterDto, toMeDto } from './mapper/auth-response.mapper';
import { TokenPayload } from './interfaces/TokenPayload.interface';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL')
    private UserModel: Model<User>,
    private configService: ConfigService,

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
      const createdUser = await this.UserModel.create({
        ...dto,
        password: hashedPassword,
      });
      return {
        message: 'User created successfully',
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
}