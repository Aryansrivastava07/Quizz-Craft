import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faList, faUserShield, faShare } from "@fortawesome/free-solid-svg-icons";
import { quizAPI } from "../utils/api";

export const QuizCreated = ({ quizzesCreated, loading, error }) => {
  const [quizzes, setQuizzes] = useState(quizzesCreated || []);
  const [copiedQuizId, setCopiedQuizId] = useState(null);

  const handleShareQuiz = async (quizId, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(quizId);
      setCopiedQuizId(quizId);
      setTimeout(() => setCopiedQuizId(null), 2000);
    } catch (err) {
      console.error('Failed to copy quiz ID:', err);
    }
  };

  useEffect(() => {
    if (quizzesCreated) {
      setQuizzes(quizzesCreated);
    }
  }, [quizzesCreated]);
  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Created</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading your quizzes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Created</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  const displayQuizzes = quizzes.length > 0 ? quizzes : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Created</h2>

      {displayQuizzes.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600 dark:text-gray-300">No quizzes created yet. Start creating your first quiz!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayQuizzes.map((quiz, index) => (
          <div key={quiz._id || quiz.id || index} className="space-y-3">
            <div
              className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative cursor-pointer"
              onClick={() => {/* Navigate to quiz stats/details */}}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10 cursor-pointer">
                View Stats →
              </div>

              {/* Quiz Card Content */}
              <div className="z-0 space-y-3">
                <h3 className="text-xl font-bold text-[#354960] dark:text-white">{quiz.title || 'Untitled Quiz'}</h3>
                <p className="text-sm text-[#6b7280] dark:text-gray-300">Category: {quiz.category || 'General'}</p>
                <p className="text-sm text-[#6b7280] dark:text-gray-300">Questions: {quiz.questions?.length || 0}</p>
                <div className="flex justify-between items-center text-sm text-[#4b5563] dark:text-gray-300">
                  <span>
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    Attempts: {quiz.totalAttempts || 0}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-400" />
                    Avg Score: {quiz.averageScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6169f9] font-medium">
                    🏆 Badge: {quiz.badgeEarned || 'None'}
                  </span>
                  <span className="text-[#10b981] font-semibold">
                    {quiz.type === "public" ? "🌍 Public" : "🔒 Private"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                  Created on: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
            
            {/* Share Button - Outside the card */}
            <button
              onClick={(e) => handleShareQuiz(quiz._id || quiz.id, e)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faShare} />
              {copiedQuizId === (quiz._id || quiz.id) ? 'Quiz ID Copied!' : 'Share Quiz'}
            </button>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};
