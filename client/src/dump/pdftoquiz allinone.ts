import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker"; // Ensure the worker is loaded
import { PDFDocument } from "pdf-lib";

const createNewPDF = async (originalPdfBytes, selectedPages) => {
  const originalPdf = await PDFDocument.load(originalPdfBytes);
  const newPdf = await PDFDocument.create();

  for (const pageNumber of selectedPages) {
    const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNumber - 1]);
    newPdf.addPage(copiedPage);
  }

  const newPdfBytes = await newPdf.save();
  return newPdfBytes;
};

export function PdftoQuiz() {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async function () {
      const pdfData = new Uint8Array(reader.result);
      if (pdfData.length === 0) {
        alert("Failed to load PDF data!");
        return;
      }
      setPdfBytes(new Uint8Array(pdfData));
      try {
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const numPages = pdf.numPages;
        const pageImages = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderTask = page.render({ canvasContext: context, viewport });
          await renderTask.promise;
          pageImages.push({
            pageNumber: i,
            imageData: canvas.toDataURL("image/png"),
          });
        }
        setPages(pageImages);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Failed to process the PDF. Please try another file.");
      }
    };
    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };
  };
  const handleCheckboxChange = (pageNumber) => {
    const index = selectedPages.indexOf(pageNumber);
    if (index !== -1) {
      const newItems = [...selectedPages];
      newItems.splice(index, 1);
      setSelectedPages(newItems);
    } else {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };
  return (
    <div className=" w-full  flex flex-col items-center justify-center">
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
          onChange={() => {
            handleFileUpload(event);
            setFile(document.getElementById("pdf").files[0].name);
          }}
          className="hidden"
        />
        <label htmlFor="pdf">
          {!file && (
            <button
              type="button"
              className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl"
              onClick={() => document.getElementById("pdf").click()}
            >
              Select files
            </button>
          )}
          {file && (
            <button
              type="button"
              className="bg-[#919fca] font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl"
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
      <div className="flex flex-row gap-4 flex-nowrap mt-10 overflow-x-auto">
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            className="flex-shrink-0 flex-grow-0 flex-basis-[100px] min-w-[100px] max-w-[150px]"
            onClick={() => {
              const checkbox = document.getElementById(
                `checkbox${page.pageNumber}`
              );
              checkbox.checked = !checkbox.checked;
              handleCheckboxChange(page.pageNumber);
              checkbox.parentElement
                .querySelector("img")
                .classList.toggle("opacity-100");
              checkbox.parentElement
                .querySelector("img")
                .classList.toggle("opacity-35");
            }}
          >
            <img
              src={page.imageData}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-auto border-2 opacity-35"
            />
            <p className="text-center">{page.pageNumber}</p>
            <input
              type="checkbox"
              id={"checkbox" + page.pageNumber}
              value={page.pageNumber}
              className="hidden"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl"
        onClick={() => {
          createNewPDF(pdfBytes, selectedPages).then((newPdfBytes) => {
            const blob = new Blob([newPdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "selected_pages.pdf";
            a.click();
          });
        }}
      >
        Generate
      </button>
    </div>
  );
}
