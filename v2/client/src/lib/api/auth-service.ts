import { apiClient } from "./client";
import { API_ROUTES } from "./routes";
import {
  RegisterAuthDto,
  LoginAuthDto,
  VerifyOTPAuthDto,
  ResendOTPDto,
  SendPasswordResetMailDto,
  ResetPasswordAuthDto,
  UserMe,
} from "./types";

export const authService = {
  /**
   * Get current authenticated user profile session
   * Requires valid accessToken cookie
   */
  async getMe() {
    return apiClient<{ user: UserMe }>(API_ROUTES.auth.me, {
      method: "GET",
    });
  },

  /**
   * Register a new user account with strong password
   * Triggers verification OTP email
   */
  async register(data: RegisterAuthDto) {
    return apiClient<{ user: Partial<UserMe> }>(API_ROUTES.auth.register, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Login with email and password
   * Sets httpOnly accessToken and refreshToken cookies
   */
  async login(data: LoginAuthDto) {
    return apiClient<{ user: UserMe }>(API_ROUTES.auth.login, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout user session and clear cookies
   */
  async logout() {
    return apiClient<boolean>(API_ROUTES.auth.logout, {
      method: "POST",
    });
  },

  /**
   * Refresh access and refresh tokens using cookie
   */
  async refresh() {
    return apiClient<{ user: UserMe }>(API_ROUTES.auth.refresh, {
      method: "POST",
    });
  },

  /**
   * Resend verification OTP for registration
   */
  async resendRegisterOTP(data: ResendOTPDto) {
    return apiClient<boolean>(API_ROUTES.auth.resendRegisterOTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify email registration with OTP code
   * Sets access & refresh token cookies on success
   */
  async verifyRegisterOTP(data: VerifyOTPAuthDto) {
    return apiClient<{ user: UserMe }>(API_ROUTES.auth.verifyRegisterOTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Send password reset OTP email
   */
  async sendPasswordResetMail(data: SendPasswordResetMailDto) {
    return apiClient<boolean>(API_ROUTES.auth.sendPasswordResetMail, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify password reset OTP code
   * Sets short-lived RESET_PASS_TOKEN cookie
   */
  async verifyPasswordResetOTP(data: VerifyOTPAuthDto) {
    return apiClient<boolean>(API_ROUTES.auth.verifyPasswordResetOTP, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Reset user password
   * Requires RESET_PASS_TOKEN cookie
   */
  async resetPassword(data: ResetPasswordAuthDto) {
    return apiClient<boolean>(API_ROUTES.auth.resetPassword, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
