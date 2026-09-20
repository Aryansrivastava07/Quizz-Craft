import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faMedal, faShare } from "@fortawesome/free-solid-svg-icons";
import { attemptAPI } from "../utils/api";

export const QuizAttempted = ({ quizAttempted, loading, error }) => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(quizAttempted || []);
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
    if (quizAttempted) {
      setAttempts(quizAttempted);
    }
  }, [quizAttempted]);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Attempted</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading your quiz attempts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Attempted</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  const displayAttempts = attempts.length > 0 ? attempts : [];

  const handleViewPerformance = (attemptId) => {
    navigate("/Result", {
      state: {
        attemptId: attemptId
      }
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] dark:text-white mb-6 text-center">Quizzes You Attempted</h2>

      {displayAttempts.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg text-gray-600 dark:text-gray-300">No quiz attempts yet. Start taking some quizzes!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAttempts.map((quiz, index) => (
            <div key={quiz._id || quiz.id || index} className="space-y-3">
              <div
                className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all relative cursor-pointer"
                onClick={() => handleViewPerformance(quiz._id)}
              >
                {/* Desktop Hover Overlay */}
                <div 
                  className="absolute inset-0 hidden md:group-hover:flex items-center justify-center bg-[#0000004d] backdrop-blur-md text-white text-lg font-bold rounded-2xl z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPerformance(quiz._id);
                  }}
                >
                  View Performance →
                </div>

                {/* Mobile Click Indicator */}
                <div className="absolute top-3 right-3 md:hidden bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  Tap to view
                </div>

                {/* Quiz Attempt Card */}
                <div className="z-0 space-y-2">
                  <h3 className="text-xl font-bold text-[#354960] dark:text-white">{quiz.quizId?.title || 'Quiz'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Submitted: {new Date(quiz.createdAt).toLocaleDateString()}</p>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>Score: <strong>{quiz.score || 0}/10</strong></span>
                    <span>Percentage: {Math.round((quiz.score / 10) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#4b5563] dark:text-gray-300">
                    <span>
                      <FontAwesomeIcon icon={faClock} className="mr-1 text-gray-500 dark:text-gray-400" />
                      Time: {quiz.timeTaken ? `${Math.floor(quiz.timeTaken / 60)}:${(quiz.timeTaken % 60).toString().padStart(2, '0')}` : 'N/A'}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faMedal} className="mr-1 text-yellow-400" />
                      {quiz.score >= 7 ? 'Excellent' : quiz.score >= 5 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <p className={`text-right text-sm font-semibold ${
                    quiz.score >= 7 ? "text-green-600" :
                    quiz.score >= 5 ? "text-blue-600" :
                    "text-red-500"
                  }`}>
                    {quiz.score >= 7 ? 'Excellent' : quiz.score >= 5 ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>
              
              {/* Share Button - Outside the card */}
              <button
                onClick={(e) => handleShareQuiz(quiz.quizId?._id || quiz.quizId, e)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faShare} />
                {copiedQuizId === (quiz.quizId?._id || quiz.quizId) ? 'Quiz ID Copied!' : 'Share Quiz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};