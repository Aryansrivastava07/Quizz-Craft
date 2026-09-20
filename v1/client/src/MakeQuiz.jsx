import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileText, 
  faVideo, 
  faImage, 
  faFilePdf, 
  faPlus, 
  faTimes,
  faEye,
  faShare,
  faPlay,
  faSpinner,
  faEdit,
  faTrash,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { handleGenerate } from "./utils/GenerateQuiz.jsx";
import { useQuiz } from "./Components/QuizContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./Components/ThemeContext";
import PdfPagesViewer from "./Components/PdfPagesViewer";

export const MakeQuiz = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const {
    quizData,
    setQuizData,
    anskey,
    setAnskey,
    uploadedFiles,
    setUploadedFiles,
    quizId,
    setQuizId,
  } = useQuiz();
  
  const [isLoading, setIsLoading] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: [],
    pdfs: []
  });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfData, setCurrentPdfData] = useState(null);
  const [showQuizViewer, setShowQuizViewer] = useState(false);
  const [activeInputs, setActiveInputs] = useState({
    prompt: false,
    image: false,
    video: false,
    pdf: false
  });
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  const toggleInput = (inputType) => {
    setActiveInputs(prev => ({
      ...prev,
      [inputType]: !prev[inputType]
    }));
  };

  const handleFileSelect = async (event, fileType) => {
    const files = Array.from(event.target.files);
    
    if (fileType === 'pdfs') {
      // For PDFs, we need to process them and show page selection
      for (const file of files) {
        await processPdfFile(file);
      }
    } else {
      setSelectedFiles(prev => ({
        ...prev,
        [fileType]: [...prev[fileType], ...files]
      }));
    }
  };

  const processPdfFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      // Import PDF processing utilities
      const { handleFileUpload } = await import('./utils/HandleFile');
      
      // Process the PDF to extract pages
      const pdfData = await new Promise((resolve, reject) => {
        handleFileUpload({
          fileUploaded: { file: file, name: file.name }, // Wrap file in expected format
          setPdfs: (updateFn) => {
            if (typeof updateFn === 'function') {
              const result = updateFn([]);
              if (result.length > 0) {
                resolve(result[0]);
              }
            }
          },
          setChatMessages: () => {} // No-op for our use case
        });
        
        // Add timeout to prevent hanging
        setTimeout(() => {
          reject(new Error('PDF processing timeout'));
        }, 10000);
      });

      if (pdfData) {
        setCurrentPdfData({
          ...pdfData,
          pdfBytes: pdfBytes,
          selectedPages: [] // Initially no pages selected
        });
        setShowPdfModal(true);
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF file. Please try again.');
    }
  };

  const handlePdfPageSelection = (selectedPages) => {
    if (currentPdfData && selectedPages.length > 0) {
      const pdfWithSelection = {
        ...currentPdfData,
        selectedPages: selectedPages
      };
      
      setSelectedFiles(prev => ({
        ...prev,
        pdfs: [...prev.pdfs, pdfWithSelection]
      }));
    }
    setShowPdfModal(false);
    setCurrentPdfData(null);
  };

  const removeFile = (fileType, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!promptText && selectedFiles.images.length === 0 && selectedFiles.videos.length === 0 && selectedFiles.pdfs.length === 0) {
      alert('Please add at least one input (prompt, image, video, or PDF)');
      return;
    }

    setIsLoading(true);
    
    // Format data to match expected structure
    const dataToSend = {
      prompt: promptText || null,
      image: selectedFiles.images.map(file => ({ file })),
      video: selectedFiles.videos.map(file => ({ file })),
      pdf: selectedFiles.pdfs // Already in correct format with selectedPages
    };

    try {
      // If only prompt is provided, use prompt-only generation
      if (promptText && selectedFiles.images.length === 0 && selectedFiles.videos.length === 0 && selectedFiles.pdfs.length === 0) {
        await handlePromptOnlyGenerate({
          prompt: promptText,
          setQuizData,
          setAnskey,
          setQuizId,
          setIsLoading
        });
      } else {
        await handleGenerate({
          uploadedFiles: dataToSend,
          setQuizData,
          setAnskey,
          setQuizId,
          setIsLoading
        });
      }
    } catch (error) {
      console.error('Quiz generation failed:', error);
      setIsLoading(false);
    }
  };

  const handlePromptOnlyGenerate = async ({ prompt, setQuizData, setAnskey, setQuizId, setIsLoading }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication error. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for multer compatibility
      const formData = new FormData();
      formData.append('prompt', prompt);

      // Step 1: Call the quizCreation endpoint with prompt only
      const createQuizResponse = await fetch(
        `${API_BASE_URL}/quiz/quizCreation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - let browser set it with boundary
          },
          body: formData
        }
      );

      if (!createQuizResponse.ok) {
        const errorData = await createQuizResponse.json();
        throw new Error(
          errorData.message || "Network response was not ok during quiz creation"
        );
      }

      const creationData = await createQuizResponse.json();
      console.log('Quiz creation response:', creationData);
      const newQuizId = creationData.data?.response?.quizId || creationData.data?.quizId;

      if (!newQuizId) {
        throw new Error("Server did not return a quiz ID after creation.");
      }

      setQuizId(newQuizId);

      // Step 2: Use the new quiz ID to fetch the full quiz data
      const getQuizResponse = await fetch(
        `${API_BASE_URL}/quiz/getQuiz?id=${newQuizId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!getQuizResponse.ok) {
        const errorData = await getQuizResponse.json();
        throw new Error(
          errorData.message || "Failed to fetch the created quiz data."
        );
      }

      const quizDataResponse = await getQuizResponse.json();
      const quiz = quizDataResponse.data.quiz;

      if (!quiz) {
        throw new Error("Server did not return quiz data.");
      }

      setQuizData(quiz);

      const answerKey = quiz.questions.map((q) => ({
        correct_answer: q.answer,
        explanation: q.explanation,
      }));
      setAnskey(answerKey);

      setIsLoading(false);
    } catch (err) {
      console.error("Prompt-only quiz generation error:", err);
      setIsLoading(false);
      alert(`Error generating quiz: ${err.message}`);
    }
  };

  const resetForm = () => {
    setQuizData(null);
    setQuizId(null);
    setAnskey([]);
    setPromptText("");
    setSelectedFiles({ images: [], videos: [], pdfs: [] });
    setActiveInputs({ prompt: false, image: false, video: false, pdf: false });
    setShowQuizViewer(false);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explanation: ""
    };
    
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleDeleteQuestion = (questionIndex) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const handleQuestionUpdate = (questionIndex, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionUpdate = (questionIndex, optionIndex, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) => 
        index === questionIndex 
          ? { ...q, options: q.options.map((opt, optIdx) => optIdx === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  if (quizData && !isLoading) {
    if (showQuizViewer) {
      return (
        <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowQuizViewer(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-lg sm:text-xl" />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">{quizData.title}</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{quizData.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="hidden sm:inline">Add Question</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {quizData.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                        Q{questionIndex + 1}
                      </h3>
                      <button
                        onClick={() => handleDeleteQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 sm:p-1"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-base sm:text-lg" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => handleQuestionUpdate(questionIndex, 'question', e.target.value)}
                          className="w-full p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                          placeholder="Enter your question here..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Options
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                              {String.fromCharCode(65 + optionIndex)}
                            </label>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionUpdate(questionIndex, optionIndex, e.target.value)}
                              className="w-full p-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>
                        ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Correct Answer
                          </label>
                          <select
                            value={question.answer}
                            onChange={(e) => handleQuestionUpdate(questionIndex, 'answer', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select correct answer</option>
                            {question.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Explanation (Optional)
                          </label>
                          <input
                            type="text"
                            value={question.explanation || ''}
                            onChange={(e) => handleQuestionUpdate(questionIndex, 'explanation', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Explain why this is correct..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={() => setShowQuizViewer(false)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-lg transform transition hover:scale-105 w-full sm:w-auto"
                >
                  Back to Actions
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEye} className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Generated Successfully!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your quiz has been created with {quizData.questions?.length || 0} questions. 
                Choose what you'd like to do next.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 flex flex-col items-center gap-2"
                onClick={() => setShowQuizViewer(true)}
              >
                <FontAwesomeIcon icon={faEye} className="text-2xl" />
                <span>View Quiz</span>
              </button>
              
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 flex flex-col items-center gap-2"
                onClick={() => {
                  if (quizId) {
                    navigate("/QuizPlatform", {
                      state: { quizId: quizId }
                    });
                  } else {
                    alert("No quiz ID available. Please create a quiz first.");
                  }
                }}
              >
                <FontAwesomeIcon icon={faPlay} className="text-2xl" />
                <span>Attempt Quiz</span>
              </button>
              
              <button 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 flex flex-col items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/QuizPlatform?id=${quizId}`);
                  alert("Quiz link copied to clipboard!");
                }}
              >
                <FontAwesomeIcon icon={faShare} className="text-2xl" />
                <span>Share Quiz</span>
              </button>
              
              <button 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 flex flex-col items-center gap-2"
                onClick={resetForm}
              >
                <FontAwesomeIcon icon={faPlus} className="text-2xl" />
                <span>Create New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">Create Your Quiz</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
            Choose your content sources and generate an intelligent quiz
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6">Select Content Sources</h2>
          
          {/* Input Type Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => toggleInput('prompt')}
              className={`p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                activeInputs.prompt 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={faFileText} className="text-xl sm:text-2xl lg:text-3xl" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Text Prompt</span>
            </button>
            
            <button
              onClick={() => toggleInput('image')}
              className={`p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                activeInputs.image 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={faImage} className="text-xl sm:text-2xl lg:text-3xl" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Images</span>
            </button>
            
            <button
              onClick={() => toggleInput('video')}
              className={`p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                activeInputs.video 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={faVideo} className="text-xl sm:text-2xl lg:text-3xl" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Videos</span>
            </button>
            
            <button
              onClick={() => toggleInput('pdf')}
              className={`p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 sm:gap-3 ${
                activeInputs.pdf 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-xl sm:text-2xl lg:text-3xl" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">PDF Files</span>
            </button>
          </div>

          {/* Dynamic Input Sections */}
          <div className="space-y-6">
            {activeInputs.prompt && (
              <div className="border border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/10">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <FontAwesomeIcon icon={faFileText} className="mr-2 text-blue-500" />
                  Enter your text prompt
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe the topic or content you want to create a quiz about..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            )}

            {activeInputs.image && (
              <FileUploadSection 
                title="Upload Images"
                icon={faImage}
                color="green"
                fileType="images"
                accept="image/*"
                selectedFiles={selectedFiles.images}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
              />
            )}

            {activeInputs.video && (
              <FileUploadSection 
                title="Upload Videos"
                icon={faVideo}
                color="purple"
                fileType="videos"
                accept="video/*"
                selectedFiles={selectedFiles.videos}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
              />
            )}

            {activeInputs.pdf && (
              <FileUploadSection 
                title="Upload PDF Files"
                icon={faFilePdf}
                color="red"
                fileType="pdfs"
                accept=".pdf"
                selectedFiles={selectedFiles.pdfs}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
              />
            )}
          </div>

          {/* Generate Button */}
          <div className="mt-8 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <FontAwesomeIcon icon={faSpinner} className="text-2xl text-blue-500 animate-spin" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Generating Quiz...
                </span>
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!promptText && selectedFiles.images.length === 0 && selectedFiles.videos.length === 0 && selectedFiles.pdfs.length === 0}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl disabled:hover:scale-100 text-base sm:text-lg w-full"
              >
                Generate Quiz
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Page Selection Modal */}
      {showPdfModal && currentPdfData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Select PDF Pages
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Choose which pages to include in your quiz from "{currentPdfData.pdf?.name}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    setCurrentPdfData(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <PdfPagesViewer 
                pdf={currentPdfData} 
                setPdfs={(updateFn) => {
                  if (typeof updateFn === 'function') {
                    const updated = updateFn([currentPdfData]);
                    if (updated.length > 0) {
                      setCurrentPdfData(updated[0]);
                    }
                  }
                }}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {currentPdfData.selectedPages?.length || 0} pages selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    setCurrentPdfData(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePdfPageSelection(currentPdfData.selectedPages || [])}
                  disabled={!currentPdfData.selectedPages || currentPdfData.selectedPages.length === 0}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition hover:scale-105 disabled:hover:scale-100"
                >
                  Add Selected Pages
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileUploadSection = ({ title, icon, color, fileType, accept, selectedFiles, onFileSelect, onRemoveFile }) => {
  const colorClasses = {
    green: {
      border: 'border-green-200 dark:border-green-800',
      bg: 'bg-green-50/50 dark:bg-green-900/10',
      text: 'text-green-500',
      button: 'bg-green-500 hover:bg-green-600'
    },
    purple: {
      border: 'border-purple-200 dark:border-purple-800',
      bg: 'bg-purple-50/50 dark:bg-purple-900/10',
      text: 'text-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600'
    },
    red: {
      border: 'border-red-200 dark:border-red-800',
      bg: 'bg-red-50/50 dark:bg-red-900/10',
      text: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`border rounded-xl p-6 ${colors.border} ${colors.bg}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        <FontAwesomeIcon icon={icon} className={`mr-2 ${colors.text}`} />
        {title}
      </label>
      
      <div className="space-y-3">
        <input
          type="file"
          accept={accept}
          multiple
          onChange={(e) => onFileSelect(e, fileType)}
          className="hidden"
          id={`file-${fileType}`}
        />
        
        <label
          htmlFor={`file-${fileType}`}
          className={`inline-flex items-center gap-2 px-4 py-2 ${colors.button} text-white rounded-lg cursor-pointer transition-colors`}
        >
          <FontAwesomeIcon icon={faPlus} />
          Choose Files
        </label>
        
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {fileType === 'pdfs' ? `${file.pdf?.name || file.name} (${file.selectedPages?.length || 0} pages)` : (file.name || 'Unknown file')}
                </span>
                <button
                  onClick={() => onRemoveFile(fileType, index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
