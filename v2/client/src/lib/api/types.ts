/**
 * Backend Data Transfer Objects & Schema Types
 * Synced with D:\Aryan\coding\projects\quizz-craft\backend
 */

// Standard Response Interceptor Envelope from Backend
export interface BackendResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface BackendErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
  method: string;
}

// ==================== AUTH TYPES ====================
export interface RegisterAuthDto {
  username: string;
  email: string;
  password: string; // Requires strong password (uppercase, lowercase, number, symbol, min 8)
}

export interface LoginAuthDto {
  email: string;
  password: string;
}

export interface VerifyOTPAuthDto {
  email: string;
  OTP: string;
}

export interface ResendOTPDto {
  email: string;
}

export interface SendPasswordResetMailDto {
  email: string;
}

export interface ResetPasswordAuthDto {
  email: string;
  password: string;
}

export interface UserMe {
  userId: string;
  email: string;
  username: string;
  verified: boolean;
  profilePicture?: string;
  averageScore?: number;
  quizAttempted?: number;
  createdAt?: string;
}

// ==================== QUIZ TYPES ====================
export interface QuizQuestion {
  questionId: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  level?: "EASY" | "MEDIUM" | "HARD" | string;
  xp?: number;
}

export interface QuizStats {
  peopleAttempted?: number;
  averageScore?: number;
}

export interface Quiz {
  quizId: string;
  title: string;
  immediateResult?: boolean;
  questime?: number;
  dynamicShuffle?: boolean;
  temporalLimit?: boolean;
  questions: QuizQuestion[];
  stats?: QuizStats;
  createdAt?: string;
}

export interface GenerateQuizParams {
  prompt: string;
  images?: File[];
  videos?: File[];
  pdfs?: File[];
}

export interface AttemptSession {
  sessionId: string;
  quizId: string;
  userId: string;
  isActive: boolean;
  lastUpdateAt: string;
  Responses: {
    questionId: string;
    chosenOption: string[];
  }[];
  score?: number | null;
}

export interface AnswerQuizDto {
  questionId: string;
  option: string;
}

// ==================== PROFILE TYPES ====================
export interface UserProfile {
  _id?: string;
  username: string;
  email: string;
  verified: boolean;
  profilePicture: string;
  mobileNo: number | null;
  address: string;
  dateOfBirth: string | null;
  averageScore: number;
  quizAttempted: number;
}

export interface UpdateProfileDto {
  email: string;
  userName: string;
}
