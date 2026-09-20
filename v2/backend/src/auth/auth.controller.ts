import { Controller, Post, Body, UseInterceptors, Res, Req, UseGuards, HttpCode, UnauthorizedException, Get, } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto, LogoutAuthDto, VerifyOTPAuthDto, SendPasswordResetMailAuthDto, ResetPasswordAuthDto, ResendOTP } from './dto/auth.request.dto';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { SanitizeInterceptor } from '../common/interceptors/sanitize.interceptor';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResetPassGuard } from '../common/guards/reset-pass.guard';

@Controller('auth')
@UseInterceptors(LoggingInterceptor, SanitizeInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private getCookieOptions(maxAge: number) {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
      maxAge,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  Me(@Req() req) {
    const userId = req.user.userId;
    return this.authService.me({ userId });
  }

  @HttpCode(201)
  @Post('register')
  register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginAuthDto);
    const { accessToken, refreshToken, ...res } = result.data;

    response.cookie('accessToken', accessToken, this.getCookieOptions(1000 * 60 * 10));
    response.cookie('refreshToken', refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 10));

    return {
      message: result.message,
      data: res
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user.userId;

    const res = await this.authService.logout({ userId, refreshToken });
    if (!res.data) throw new UnauthorizedException('Logout failed');

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return res;
  }


  @HttpCode(200)
  @Post('refresh')
  async Refresh(@Req() req, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies.refreshToken;
    const result = await this.authService.refresh({ refreshToken });
    const { accessToken, refreshToken: newRefreshToken, ...res } = result.data;

    response.cookie('accessToken', accessToken, this.getCookieOptions(1000 * 60 * 10));
    response.cookie('refreshToken', newRefreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 10));

    return {
      message: result.message,
      data: res
    };
  }

  @HttpCode(200)
  @Post('resend-register-otp')
  async ResendRegisterOTP(@Body() dto: ResendOTP){
    return this.authService.ResendRegisterOTP(dto);
  }

  @HttpCode(200)
  @Post('verify-register-otp')
  async verifyRegsitrationOTP(@Body() dto: VerifyOTPAuthDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.verifyRegistrationOTP(dto);
    const { accessToken, refreshToken, ...res } = result.data;

    response.cookie('accessToken', accessToken, this.getCookieOptions(1000 * 60 * 10));
    response.cookie('refreshToken', refreshToken, this.getCookieOptions(1000 * 60 * 60 * 24 * 10));

    return {
      message: result.message,
      data: res
    }
  }

  @HttpCode(200)
  @Post('send-password-reset-mail')
  sendPasswordResetMail(@Body() dto: SendPasswordResetMailAuthDto) {
    return this.authService.sendPasswordResetMail(dto);
  }

  @HttpCode(200)
  @Post('verify-password-reset-otp')
  async verifyPasswordResetOTP(@Body() dto: VerifyOTPAuthDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.verifyPasswordResetOTP(dto);
    const { RESET_PASS_TOKEN, ...res } = result.data;

    response.cookie('RESET_PASS_TOKEN', RESET_PASS_TOKEN, this.getCookieOptions(1000 * 60 * 10));

    return {
      message: result.message,
      data: res
    }
  }

  @UseGuards(ResetPassGuard)
  @HttpCode(200)
  @Post('reset-password')
  ResetPassword(@Body() dto: ResetPasswordAuthDto, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('RESET_PASS_TOKEN');
    return this.authService.ResetPassword(dto);
  }
}