import { PDFDocument } from "pdf-lib";

// Get API base URL from environment or fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const DatatoSend = {
  pdf: [],
  image: [],
  video: [],
  prompt: null,
};
const createNewPDF = async (originalPdfBytes, selectedPages) => {
  const originalPdf = await PDFDocument.load(originalPdfBytes);
  const newPdf = await PDFDocument.create();

  // pdf-lib uses zero-based indexing; convert 1-indexed numbers accordingly
  for (const pageNumber of selectedPages) {
    const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNumber - 1]);
    newPdf.addPage(copiedPage);
  }

  const newPdfBytes = await newPdf.save();
  return newPdfBytes;
};

const GeneratePdf = async ({ pdf }) => {
  if (!pdf.pdf) {
    throw new Error("No PDF file uploaded!");
  }
  if (pdf.selectedPages.length === 0) {
    throw new Error("No pages selected!");
  }
  const pdfBytes = pdf.pdfBytes;
  const selectedPages = pdf.selectedPages;

  // Clone pdfBytes for safe processing—in case the original is detached during PDF processing.
  const pdfBytesClone = new Uint8Array(pdfBytes.length);
  pdfBytesClone.set(pdfBytes);

  try {
    const newPdfBytes = await createNewPDF(pdfBytesClone, selectedPages);
    const blob = new Blob([newPdfBytes], { type: "application/pdf" });
    const renamedFile = new File([blob], pdf.name, { type: "application/pdf" });
    return renamedFile;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Check the console for details.");
  }
};
// const callGeneratePdf = async ({ pdf }) => {
//   if(!pdf) return null;
//   pdf.map(async (pdf) => {
//       try {
//         const Updatedpdf = await GeneratePdf({ pdf });
//         DatatoSend.pdf = [...DatatoSend.pdf, Updatedpdf];
//       } catch (error) {
//         console.error("Error processing PDF:", error);
//       }
//     });
// }
const callGeneratePdf = async (pdfArray) => {
  if (!pdfArray || pdfArray.length === 0) return [];

  const editedPdfs = await Promise.all(
    pdfArray.map(async (pdf) => {
      try {
        const Updatedpdf = await GeneratePdf({ pdf });
        DatatoSend.pdf = [...DatatoSend.pdf, Updatedpdf];
      } catch (error) {
        console.error("Error processing PDF:", error);
        return null; // Or handle how you want to skip failed ones
      }
    })
  );

  // Filter out any nulls
  return editedPdfs.filter((f) => f !== null);
};

export const handleGenerate = async ({
  uploadedFiles,
  setQuizData,
  setAnskey,
  setQuizId,
  setIsLoading,
  setChatMessages,
}) => {
  if (
    uploadedFiles.pdf.length > 0 ||
    uploadedFiles.image.length > 0 ||
    uploadedFiles.video.length > 0
  ) {
    // Set loading state
    if (setIsLoading) setIsLoading(true);

    // Add loading message to chat
    if (setChatMessages) {
      setChatMessages((prev) => [
        ...prev,
        {
          text: "🔄 Generating your quiz... This may take a few moments.",
          content: (
            <div className="flex items-center gap-2 mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">
                Processing your files and creating questions...
              </span>
            </div>
          ),
        },
      ]);
    }

    for (const pdf of uploadedFiles.pdf) {
      if (pdf.selectedPages.length === 0) {
        console.error(`No pages selected for PDF: ${pdf.name}`);
        if (setIsLoading) setIsLoading(false);
        return null; // Or handle this case as an error
      }
    }
    await callGeneratePdf(uploadedFiles.pdf);
    DatatoSend.image = uploadedFiles.image;
    DatatoSend.video = uploadedFiles.video;
    fecthResponse(
      DatatoSend,
      setQuizData,
      setAnskey,
      setQuizId,
      setIsLoading,
      setChatMessages
    );
  } else {
    console.error("No files uploaded!");
  }
};

const fecthResponse = async (
  DatatoSend,
  setQuizData,
  setAnskey,
  setQuizId,
  setIsLoading,
  setChatMessages
) => {
  const formData = new FormData();
  // The server's multer middleware expects an array of files under the 'files' field name.
  DatatoSend.pdf.forEach((file) => formData.append("files", file));
  DatatoSend.image.forEach((file) => formData.append("files", file.file));
  DatatoSend.video.forEach((file) => formData.append("files", file.file));

  if (DatatoSend.prompt) {
    formData.append("prompt", DatatoSend.prompt);
  }

  // Assuming the auth token is stored in localStorage.
  // The 'authenticateUser' middleware on the server requires this.
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Authentication error. Please log in.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    // 'Content-Type' is not set for FormData; the browser sets it with the correct boundary.
  };

  try {
    // Step 1: Call the quizCreation endpoint. It returns the ID of the created quiz.
    const createQuizResponse = await fetch(
      `${API_BASE_URL}/quiz/quizCreation`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    if (!createQuizResponse.ok) {
      const errorData = await createQuizResponse.json();
      throw new Error(
        errorData.message || "Network response was not ok during quiz creation"
      );
    }

    const creationData = await createQuizResponse.json();
    const newQuizId = creationData.data.response.quizId;

    if (!newQuizId) {
      throw new Error("Server did not return a quiz ID after creation.");
    }

    setQuizId(newQuizId);

    // Step 2: Use the new quiz ID to fetch the full quiz data.
    const getQuizResponse = await fetch(
      `${API_BASE_URL}/quiz/getQuiz?id=${newQuizId}`,
      {
        method: "GET",
        headers,
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

    // The server returns the full quiz object, including answers.
    // We can now set the state for the quiz and the answer key.
    setQuizData(quiz);

    const answerKey = quiz.questions.map((q) => ({
      correct_answer: q.answer,
      explanation: q.explanation,
    }));
    setAnskey(answerKey);

    // Clear loading state
    if (setIsLoading) setIsLoading(false);

    // Clear chat history and show success message
    if (setChatMessages) {
      setChatMessages([
        {
          text: "✅ Quiz generated successfully!",
          content: (
            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                {quiz.title}
              </h3>
              <p className="text-sm text-green-700 mb-2">{quiz.description}</p>
              <div className="flex gap-2 text-xs text-green-600">
                <span>📝 {quiz.questions?.length || 0} questions</span>
                <span>⏱️ {quiz.timeLimit || "No time limit"}</span>
                <span>🎯 {quiz.difficulty || "Mixed difficulty"}</span>
              </div>
            </div>
          ),
        },
      ]);
    }
  } catch (err) {
    console.error("Fetch error:", err);

    // Clear loading state
    if (setIsLoading) setIsLoading(false);

    // Show error message in chat
    if (setChatMessages) {
      setChatMessages((prev) => [
        ...prev,
        {
          text: "❌ Failed to generate quiz",
          content: (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{err.message}</p>
              <button
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ),
        },
      ]);
    } else {
      alert(`Error generating quiz: ${err.message}`);
    }
  }
};
