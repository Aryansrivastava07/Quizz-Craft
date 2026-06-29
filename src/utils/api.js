// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Get token from localStorage
const getToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Set tokens in localStorage
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Remove tokens from localStorage
const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// API request wrapper with authentication
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/user/refreshToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setTokens(refreshData.data.accessToken, refreshToken);
            
            // Retry original request with new token
            config.headers.Authorization = `Bearer ${refreshData.data.accessToken}`;
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
            return await retryResponse.json();
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeTokens();
          window.location.href = '/auth/login';
        }
      }
      
      removeTokens();
      window.location.href = '/auth/login';
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/user/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.data.accessToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// User API functions
export const userAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  requestVerificationMail: async (userId) => {
    const response = await apiRequest(`/user/userRequestVerificationMail/${userId}`, {
      method: 'GET',
    });
    return response;
  },

  verifyUser: async (userId, verificationCode) => {
    const response = await apiRequest(`/user/userVerification/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ verificationCode }),
    });
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      setTokens(response.data.accessToken, response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: async (userId) => {
    const response = await apiRequest(`/user/logout/${userId}`, {
      method: 'POST',
    });
    removeTokens();
    return response;
  },

  getCurrentUser: async () => {
    const response = await apiRequest('/user/user', {
      method: 'GET',
    });
    return response;
  },

  updateProfile: async (profileData) => {
    const response = await apiRequest('/user/updateProfile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    return response;
  },

  uploadAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/user/updateAvatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (response.status === 401) {
      await refreshAccessToken();
      const newToken = getToken();
      const retryResponse = await fetch(`${API_BASE_URL}/user/updateAvatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
        body: formData,
      });
      return retryResponse.json();
    }
    
    return response.json();
  },

  getAvatar: async () => {
    const response = await apiRequest('/user/getAvatar', {
      method: 'GET',
    });
    return response;
  },
};

// Quiz API functions
export const quizAPI = {
  createQuiz: async (formData) => {
    const response = await apiRequest('/quiz/quizCreation', {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  getAllQuizzes: async () => {
    const response = await apiRequest('/quiz/getQuiz', {
      method: 'GET',
    });
    return response;
  },

  getQuizById: async () => {
    const response = await apiRequest('/quiz/getAllQuizById', {
      method: 'GET',
    });
    return response;
  },

  updateQuiz: async (quizData) => {
    const response = await apiRequest('/quiz/updateQuiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
    return response;
  },

  deleteQuiz: async (quizId) => {
    const response = await apiRequest(`/quiz/deleteQuiz/${quizId}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Attempt API functions
export const attemptAPI = {
  startQuiz: async (quizId) => {
    const response = await apiRequest(`/attempt/start/${quizId}`, {
      method: 'GET',
    });
    return response;
  },

  submitAttempt: async (quizId, attemptData) => {
    const response = await apiRequest(`/attempt/submit/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(attemptData),
    });
    return response;
  },

  getLeaderboard: async (quizId) => {
    const response = await apiRequest(`/attempt/leaderboard/${quizId}`, {
      method: 'GET',
    });
    return response;
  },

  getAttemptHistory: async () => {
    const response = await apiRequest('/attempt/history', {
      method: 'GET',
    });
    return response;
  },

  reviewAttempt: async (attemptId) => {
    const response = await apiRequest(`/attempt/review/${attemptId}`, {
      method: 'GET',
    });
    return response;
  },
};

// Utility functions
export const isAuthenticated = () => {
  return !!getToken();
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export { removeTokens };
