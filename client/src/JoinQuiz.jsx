import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSignInAlt, faGamepad } from '@fortawesome/free-solid-svg-icons';

const JoinQuiz = () => {
  const [quizId, setQuizId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    // Check if quiz ID is in URL parameters
    const urlQuizId = searchParams.get('id') || searchParams.get('quizId');
    if (urlQuizId) {
      setQuizId(urlQuizId);
      
      // If user is logged in and quiz ID is in URL, auto-start the quiz
      if (isLoggedIn && user) {
        handleJoinQuiz(urlQuizId);
      }
    }
  }, [searchParams, isLoggedIn, user]);

  const handleJoinQuiz = async (quizIdToJoin = quizId) => {
    if (!quizIdToJoin.trim()) {
      setError('Please enter a valid Quiz ID');
      return;
    }

    if (!isLoggedIn) {
      setError('Please log in to join a quiz');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
      const token = localStorage.getItem("accessToken");

      // First, verify the quiz exists
      const quizResponse = await fetch(
        `${API_BASE_URL}/quiz/getQuiz?id=${quizIdToJoin}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json();
        throw new Error(errorData.message || 'Quiz not found');
      }

      const quizData = await quizResponse.json();
      
      if (!quizData.success || !quizData.data.quiz) {
        throw new Error('Invalid quiz data received');
      }

      // Navigate to quiz attempt page with the quiz data
      navigate(`/attempt-quiz/${quizIdToJoin}`, { 
        state: { 
          quiz: quizData.data.quiz,
          fromJoin: true 
        } 
      });

    } catch (err) {
      console.error('Join quiz error:', err);
      setError(err.message || 'Failed to join quiz. Please check the Quiz ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuizId(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faGamepad} className="text-white text-lg sm:text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join Quiz
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Enter the Quiz ID to start playing
          </p>
        </div>

        {/* Quiz ID Input */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quiz ID
          </label>
          <input
            type="text"
            id="quizId"
            value={quizId}
            onChange={handleInputChange}
            placeholder="Enter Quiz ID"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Authentication Status */}
        {!isLoggedIn && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Please log in to join a quiz
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleJoinQuiz()}
            disabled={isLoading || !quizId.trim() || !isLoggedIn}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Joining Quiz...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPlay} />
                <span>Start Quiz</span>
              </>
            )}
          </button>

          {!isLoggedIn && (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Log In</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">How to join:</h3>
          <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Get the Quiz ID from the quiz creator</li>
            <li>• Enter it in the field above</li>
            <li>• Make sure you're logged in</li>
            <li>• Click "Start Quiz" to begin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;
