import { apiClient } from "./client";
import { API_ROUTES } from "./routes";
import {
  Quiz,
  GenerateQuizParams,
  AttemptSession,
  AnswerQuizDto,
} from "./types";

export const quizService = {
  /**
   * Generate a new AI quiz via Gemini backend provider
   * Supports multipart/form-data upload for PDFs, images, and videos
   */
  async generateQuiz(params: GenerateQuizParams) {
    const formData = new FormData();
    formData.append("prompt", params.prompt);

    if (params.images && params.images.length > 0) {
      params.images.slice(0, 5).forEach((file) => {
        formData.append("images", file);
      });
    }

    if (params.videos && params.videos.length > 0) {
      params.videos.slice(0, 1).forEach((file) => {
        formData.append("videos", file);
      });
    }

    if (params.pdfs && params.pdfs.length > 0) {
      params.pdfs.slice(0, 2).forEach((file) => {
        formData.append("pdfs", file);
      });
    }

    return apiClient<{ quiz: Quiz }>(API_ROUTES.quiz.generate, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Fetch quiz details and full question set by quizId
   * @param quizId The unique UUID of the quiz
   */
  async getQuiz(quizId: string) {
    return apiClient<{ quiz: Quiz; stats?: { peopleAttempted: number; averageScore: number } }>(
      API_ROUTES.quiz.get(quizId),
      {
        method: "GET",
      }
    );
  },

  /**
   * Update quiz details or questions
   * @param quizId The unique UUID of the quiz
   * @param data Title, immediateResult setting, and questions to update
   */
  async updateQuiz(
    quizId: string,
    data: {
      title?: string;
      questions?: any[];
      immediateResult?: boolean;
      questime?: number;
      dynamicShuffle?: boolean;
      temporalLimit?: boolean;
    }
  ) {
    return apiClient<{ updated: boolean }>(API_ROUTES.quiz.update(quizId), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Edit a single question in the quiz
   * Persists level, xp, answer, options, question statement, and explanation directly to backend
   */
  async editQuestion(
    quizId: string,
    questionId: string,
    data: {
      question?: string;
      options?: string[];
      answer?: string;
      explanation?: string;
      level?: string;
    }
  ) {
    return apiClient<{ question: any; updated: boolean }>(
      API_ROUTES.quiz.editQuestion(quizId, questionId),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Add a new question to the quiz
   */
  async addQuestion(
    quizId: string,
    data: {
      question: string;
      options: string[];
      answer: string;
      explanation?: string;
      level?: string;
    }
  ) {
    return apiClient<{ question: any; created: boolean }>(
      API_ROUTES.quiz.addQuestion(quizId),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a question from the quiz
   */
  async deleteQuestion(quizId: string, questionId: string) {
    return apiClient<{ deleted: boolean }>(
      API_ROUTES.quiz.deleteQuestion(quizId, questionId),
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Start or resume an active quiz attempt session
   * @param quizId The unique UUID of the quiz
   */
  async createAttempt(quizId: string) {
    return apiClient<{ createSession?: AttemptSession; session?: AttemptSession }>(
      API_ROUTES.quiz.attempt(quizId),
      {
        method: "GET",
      }
    );
  },

  /**
   * Save a single answer response during an active quiz attempt
   * @param sessionId Active session UUID
   * @param answer Question ID and selected option
   */
  async updateAnswer(sessionId: string, answer: AnswerQuizDto) {
    return apiClient<boolean>(API_ROUTES.quiz.updateAnswer(sessionId), {
      method: "POST",
      body: JSON.stringify(answer),
    });
  },

  /**
   * Finalize and submit all responses for a quiz session
   * Closes session and records attempt
   */
  async submitAttempt(sessionId: string, finalAnswer: AnswerQuizDto) {
    return apiClient<boolean>(API_ROUTES.quiz.submitAttempt(sessionId), {
      method: "POST",
      body: JSON.stringify(finalAnswer),
    });
  },

  /**
   * Calculate and fetch final evaluated score for a completed session
   * @param sessionId Finished session UUID
   */
  async getScore(sessionId: string) {
    return apiClient<number>(API_ROUTES.quiz.getScore(sessionId), {
      method: "GET",
    });
  },
};
