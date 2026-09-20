// PdftoQuiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages } from "../utils/PdfUtils";
import PdfPagesViewer from "./PdfPagesViewer";

// Get API base URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

export function PdftoQuiz() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
   const handleFileUpload = async (fileUploaded) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileUploaded);
  
      reader.onload = async () => {
        const pdfData = {
          pdf: fileUploaded,
          pdfBytes: new Uint8Array(reader.result),
          pages: 0,
          selectedPages: [],
        };
        const originalPdfData = new Uint8Array(reader.result);
        const pdfDataCopy = new Uint8Array(originalPdfData.length);
        pdfDataCopy.set(originalPdfData);
        pdfData.pdfBytes = pdfDataCopy;
        try {
          const extractedPages = await extractPdfPages(originalPdfData);
          pdfData.pages = extractedPages;
            setPdfs((prev) => [...prev, pdfData]);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          alert("Failed to process the PDF. Please try another file.");
        }
      };
  
      reader.onerror = () => {
        alert("Error reading the file. Please try again.");
      };
    };

  const handleGenerate = async () => {

    if (!pdfs) {
      alert("No PDF file uploaded!");
      return;
    }
    if (pdfs[pdfs.length-1].selectedPages.length === 0) {
      alert("No pages selected!");
      return;
    }
    const pdfBytes = pdfs[pdfs.length-1].pdfBytes;
    const selectedPages = pdfs[pdfs.length-1].selectedPages;

    // Clone pdfBytes for safe processing—in case the original is detached during PDF processing.
    const pdfBytesClone = new Uint8Array(pdfBytes.length);
    pdfBytesClone.set(pdfBytes);

    try {
      const newPdfBytes = await createNewPDF(pdfBytesClone, selectedPages);
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      URL.revokeObjectURL(url);
      window.generatedPdfBlob = blob;
      window.generatedPdfUrl = url;
      const formData = new FormData();
      formData.append("pdf", blob, "selected_pages.pdf");
      // Make API call to your backend to handle the PDF blob
      setLoading(true);
      fetch(`${API_BASE_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              throw new Error(
                errorData.message || "Network response was not ok"
              );
            });
          }
          return res.json();
        })
        .then((data) => {
          // setQuizData(data.data.quiz);
          console.log("Quiz Data:", data.data.quiz);
          setLoading(false);
          // Navigate to QuizPlatform with the quiz data
          const question = data.data.quiz.map((q) => q.question);
          const options = data.data.quiz.map((q) => q.options);
          console.log("Navigating to QuizPlatform with data:", {
            quizId: data.data.quizId,
            Questions: question,
            Options: options,
          });
          navigate("/QuizPlatform", {
            state: {
              quizId: data.data.quizId,
              Questions: question,
              Options: options,
            },
          });
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          alert("Error generating PDF: " + err.message);
        });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Check the console for details.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <form
        action="/"
        method="get"
        className="pt-10 flex flex-col items-center"
      >
        <input
          type="file"
          name="pdf"
          id="pdf"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files[0]) {
              setFile(e.target.files[0].name);
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        <label htmlFor="pdf">
          {!file && (
            <button
              type="button"
              className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl"
              onClick={() => document.getElementById("pdf").click()}
            >
              Select files
            </button>
          )}
          {file && (
            <button
              type="button"
              className="bg-[#919fca] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl"
              onClick={() => setFile(null)}
            >
              File Selected
            </button>
          )}
        </label>
        <p id="file-name" className="mt-2 text-gray-700">
          {file || ""}
        </p>
      </form>

      {pdfs.length > 0 && <PdfPagesViewer pdf={pdfs[pdfs.length - 1]} setPdfs={setPdfs} />}

      <button
        type="button"
        className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 text-white cursor-pointer rounded-xl mt-5"
        onClick={handleGenerate}
      >
        Generate
      </button>
      {loading && (
        <div className="mt-5">
          <p className="text-gray-700">Generating quiz, please wait...</p>
        </div>
      )}
    </div>
  );
}
