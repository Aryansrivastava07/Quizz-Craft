import { useState } from "react";
import { useQuiz } from "./QuizContext";
// import { AddQuestionForm } from "./Somewhere/AddQuestionForm"; // adjust import as needed

const handleFileChange = (event, type, { setUploadedFiles }) => {
  const newFiles = Array.from(event.target.files);

  setUploadedFiles((prev) => {
    const existingSignatures = prev[type].map(
      (f) => `${f.name}-${f.size}-${f.lastModified}`
    );

    const uniqueFiles = newFiles.filter((file) => {
      const signature = `${file.name}-${file.size}-${file.lastModified}`;
      return !existingSignatures.includes(signature);
    });

    if (uniqueFiles.length > 0) {
      const newFilesObj = { ...prev };
      uniqueFiles.forEach((file) => {
        newFilesObj[type] = [...newFilesObj[type], { name: file.name, file }];
      });
      return newFilesObj;
    } else {
      return prev; // no change
    }
  });

  event.target.value = null; // Reset input for re-selection
};

// This function returns the presets with the latest context values
export function useChatPresets(setChatMessages) {
  const {
    quizData,
    setQuizData,
    anskey,
    setAnskey,
    uploadedFiles,
    setUploadedFiles,
    // setChatMessages, // make sure this is in your context!
  } = useQuiz();

  return {
    Upload: {
      text: "Upload your files below",
      content: (
        <div className="flex flex-row gap-4 max-w-sm mx-auto mt-8">
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "pdf", { setUploadedFiles })}
              className="hidden"
              id="upload-pdf"
            />
            <label
              htmlFor="upload-pdf"
              className="block w-full text-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload PDF
            </label>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleFileChange(e, "image", { setUploadedFiles })
              }
              className="hidden"
              id="upload-image"
            />
            <label
              htmlFor="upload-image"
              className="block w-full text-center cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload Image
            </label>
          </div>
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleFileChange(e, "video", { setUploadedFiles })
              }
              className="hidden"
              id="upload-video"
            />
            <label
              htmlFor="upload-video"
              className="block w-full text-center cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Upload Video
            </label>
          </div>
        </div>
      ),
    },
    QuizData: {
      text: "Quiz Generated:",
      content: (
        <div className="quiz-display">
          {quizData && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-xl font-bold text-blue-800 mb-2">{quizData.title}</h2>
              <p className="text-sm text-blue-700 mb-2">{quizData.description}</p>
              <div className="flex gap-4 text-xs text-blue-600">
                <span>📝 {quizData.questions?.length || 0} questions</span>
                <span>⏱️ {quizData.timeLimit || 'No time limit'}</span>
                <span>🎯 {quizData.difficulty || 'Mixed difficulty'}</span>
              </div>
            </div>
          )}
          {quizData && quizData.questions && Array.isArray(quizData.questions) &&
            quizData.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="question-block border p-4 mb-4 rounded-lg shadow-md bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-4">
                    <span className="text-blue-600">Q{qIndex + 1}:</span> {question.question}
                  </h3>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    onClick={() => {
                      const updatedQuestions = quizData.questions.filter((_, i) => i !== qIndex);
                      setQuizData({...quizData, questions: updatedQuestions});
                      setAnskey((prevAnskey) =>
                        prevAnskey.filter((_, i) => i !== qIndex)
                      );
                    }}
                  >
                    Delete
                  </button>
                </div>
                <ul className="space-y-2">
                  {question.options && question.options.map((option, oIndex) => (
                    <li
                      key={oIndex}
                      className={`p-2 rounded border ${
                        question.answer === oIndex || 
                        (typeof question.answer === 'string' && question.answer === option)
                          ? "bg-green-100 border-green-300 text-green-800 font-medium"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="font-medium text-gray-600">{String.fromCharCode(65 + oIndex)}.</span> {option}
                      {(question.answer === oIndex || 
                        (typeof question.answer === 'string' && question.answer === option)) && 
                        <span className="ml-2 text-green-600">✓ Correct</span>
                      }
                    </li>
                  ))}
                </ul>
                {question.explanation && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          {!quizData && (
            <div className="text-center text-gray-500 py-8">
              <p>No quiz data available. Please generate a quiz first.</p>
            </div>
          )}
          {quizData && (
            <button
              className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setChatMessages((prev) => [
                  ...prev,
                  {
                    text: "Add a new question:",
                    content: (
                      <AddQuestionForm
                        setChatMessages={setChatMessages}
                        setQuizData={setQuizData}
                        setAnskey={setAnskey}
                      />
                    ),
                  },
                ]);
              }}
            >
              Add New Question
            </button>
          )}
        </div>
      ),
    },
    AddQuestion: {
      text: "Add a new question:",
      content: (
        <AddQuestionForm
          setChatMessages={setChatMessages}
          setQuizData={setQuizData}
          setAnskey={setAnskey}
        />
      ),
    },
  };
}
const AddQuestionForm = ({ setChatMessages, setQuizData, setAnskey }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      question: questionText,
      options: options.filter((option) => option.trim() !== ""), // Filter out empty options
    };

    setQuizData((prevQuizData) => {
      if (!prevQuizData || !prevQuizData.questions) {
        return { questions: [newQuestion] };
      }
      return {
        ...prevQuizData,
        questions: [...prevQuizData.questions, newQuestion]
      };
    });
    setAnskey((prevAnskey) => {
      if (!prevAnskey) return [correctAnswer];
      return [...prevAnskey, correctAnswer];
    });

    setChatMessages((prev) => [
      ...prev,
      { text: "Question added successfully!", content: null },
    ]);

    // Clear form
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">+</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Add New Question</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Correct</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setQuestionText("");
                setOptions(["", "", "", ""]);
                setCorrectAnswer(0);
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md"
            >
              ✅ Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
