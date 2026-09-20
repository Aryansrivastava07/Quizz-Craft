import { apiClient } from "./client";
import { API_ROUTES } from "./routes";
import { UserProfile, UpdateProfileDto, Quiz, AttemptSession } from "./types";

export const profileService = {
  /**
   * Get user profile details by email query
   * @param email User email
   */
  async getProfile(email: string) {
    return apiClient<UserProfile>(API_ROUTES.profile.get(email), {
      method: "GET",
    });
  },

  /**
   * Update profile information (username)
   * Note: Backend currently only supports updating userName
   */
  async updateProfile(data: UpdateProfileDto) {
    return apiClient<{ updated: boolean }>(API_ROUTES.profile.update, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get quizzes created by the authenticated user
   */
  async getQuizzes() {
    return apiClient<{ quizzes: Quiz[] }>(API_ROUTES.profile.quizzes, {
      method: "GET",
    });
  },

  /**
   * Get quiz attempt history for the authenticated user
   */
  async getHistory() {
    return apiClient<{ history?: (AttemptSession & { title?: string; totalQuestions?: number })[]; quizzes?: AttemptSession[] }>(API_ROUTES.profile.history, {
      method: "GET",
    });
  },
};
