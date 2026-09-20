import React, { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [anskey, setAnskey] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    pdf: [],
    image: [],
    video: [],
  });
  // Add more shared state as needed

  return (
    <QuizContext.Provider
      value={{
        quizData,
        setQuizData,
        anskey,
        setAnskey,
        uploadedFiles,
        setUploadedFiles,
        quizId,
        setQuizId
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);