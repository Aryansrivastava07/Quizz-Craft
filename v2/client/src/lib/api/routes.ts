/**
 * Backend API Route Definitions
 * Mapped from NestJS Controllers in D:\Aryan\coding\projects\quizz-craft\backend
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const API_ROUTES = {
  // ==========================================
  // AUTH ROUTES (Prefix: /auth)
  // File: src/auth/auth.controller.ts
  // ==========================================
  auth: {
    base: `${API_BASE_URL}/auth`,
    me: `${API_BASE_URL}/auth/me`,                                  // GET  (JwtAuthGuard)
    register: `${API_BASE_URL}/auth/register`,                      // POST
    login: `${API_BASE_URL}/auth/login`,                            // POST (sets accessToken & refreshToken cookies)
    logout: `${API_BASE_URL}/auth/logout`,                          // POST (JwtAuthGuard, clears cookies)
    refresh: `${API_BASE_URL}/auth/refresh`,                        // POST (rotates tokens via cookies)
    resendRegisterOTP: `${API_BASE_URL}/auth/resend-register-otp`,  // POST
    verifyRegisterOTP: `${API_BASE_URL}/auth/verify-register-otp`,  // POST (sets cookies on success)
    sendPasswordResetMail: `${API_BASE_URL}/auth/send-password-reset-mail`, // POST
    verifyPasswordResetOTP: `${API_BASE_URL}/auth/verify-password-reset-otp`, // POST (sets RESET_PASS_TOKEN cookie)
    resetPassword: `${API_BASE_URL}/auth/reset-password`,          // POST (ResetPassGuard)
  },

  // ==========================================
  // QUIZ ROUTES (Prefix: /api/quiz)
  // File: src/quiz/quiz.controller.ts
  // Note: All routes protected by JwtAuthGuard
  // ==========================================
  quiz: {
    base: `${API_BASE_URL}/api/quiz`,
    // POST multipart/form-data: prompt, images, videos, pdfs
    generate: `${API_BASE_URL}/api/quiz/generate`,
    // GET: Fetch quiz details and questions by quizId
    get: (quizId: string) => `${API_BASE_URL}/api/quiz/${quizId}`,
    // PUT: Update quiz details and questions by quizId
    update: (quizId: string) => `${API_BASE_URL}/api/quiz/${quizId}`,
    // PUT: Edit a single question inside a quiz
    editQuestion: (quizId: string, questionId: string) =>
      `${API_BASE_URL}/api/quiz/${quizId}/question/${questionId}`,
    // POST: Add a new question to a quiz
    addQuestion: (quizId: string) => `${API_BASE_URL}/api/quiz/${quizId}/question`,
    // DELETE: Remove a question from a quiz
    deleteQuestion: (quizId: string, questionId: string) =>
      `${API_BASE_URL}/api/quiz/${quizId}/question/${questionId}`,
    // GET: Start or resume an active session for a quiz
    attempt: (quizId: string) => `${API_BASE_URL}/api/quiz/attempt/${quizId}`,
    // POST: Update answer for questionId in active session
    updateAnswer: (sessionId: string) => `${API_BASE_URL}/api/quiz/attempt/answer/${sessionId}`,
    // POST: Finalize session responses & submit
    submitAttempt: (sessionId: string) => `${API_BASE_URL}/api/quiz/attempt/submit/${sessionId}`,
    // GET: Calculate final score for submitted session
    getScore: (sessionId: string) => `${API_BASE_URL}/api/quiz/score/${sessionId}`,
  },

  // ==========================================
  // PROFILE ROUTES (Prefix: /api/profile)
  // File: src/profile/profile.controller.ts
  // Note: All routes protected by JwtAuthGuard
  // ==========================================
  profile: {
    base: `${API_BASE_URL}/api/profile`,
    // GET ?email=...: Get profile info
    get: (email: string) => `${API_BASE_URL}/api/profile?email=${encodeURIComponent(email)}`,
    // POST: Update username { email, userName }
    update: `${API_BASE_URL}/api/profile`,
    // GET: Get quizzes for authenticated user (from JWT email)
    quizzes: `${API_BASE_URL}/api/profile/quizzes`,
    // GET: Get past quiz attempts for authenticated user (from JWT email)
    history: `${API_BASE_URL}/api/profile/history`,
  },
} as const;
