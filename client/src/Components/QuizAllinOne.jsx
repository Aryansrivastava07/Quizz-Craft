import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { extractPdfPages } from "./pdfUtils";
import PdfPagesViewer from "./PdfPagesViewer";

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

export const AllinOneForm = () => {
  const [selectedPages, setSelectedPages] = useState([]);
  const [pages, setPages] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);

  const handleFileUpload = async (e) => {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded || fileUploaded.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(fileUploaded);

    reader.onload = async () => {
      // Read the raw data from the file
      const originalPdfData = new Uint8Array(reader.result);

      // Clone the data for storage—this copy will be used when generating the new PDF
      const pdfDataCopy = new Uint8Array(originalPdfData.length);
      pdfDataCopy.set(originalPdfData);
      setPdfBytes(pdfDataCopy);

      try {
        const extractedPages = await extractPdfPages(originalPdfData);
        setPages(extractedPages);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Failed to process the PDF. Please try another file.");
      }
    };

    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };
  };

  const handlePageToggle = (pageNumber) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageNumber)
        ? prevSelected.filter((num) => num !== pageNumber)
        : [...prevSelected, pageNumber]
    );
  };

  const handleGenerate = async () => {
    if (!pdfBytes) {
      alert("No PDF file uploaded!");
      return;
    }
    if (selectedPages.length === 0) {
      alert("No pages selected!");
      return;
    }

    // Clone pdfBytes for safe processing—in case the original is detached during PDF processing.
    const pdfBytesClone = new Uint8Array(pdfBytes.length);
    pdfBytesClone.set(pdfBytes);

    try {
      const newPdfBytes = await createNewPDF(pdfBytesClone, selectedPages);
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "selected_pages.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Check the console for details.");
    }
  };
  const cardBase =
    "w-full max-w-[80vw] mx-auto mt-10 bg-amber-8 rounded-2xl shadow-2xl relative transition-all";
  const [file, setFile] = useState(null);
  return (
    <section className="">
      <p className="relative my-8 text-center text-4xl text-amber-600 font-semibold">
        <span className="before:absolute before:top-1/2 before:left-0 before:w-1/3 before:h-[2px] before:bg-amber-300 before:content-['']" />
        OR
        <span className="after:absolute after:top-1/2 after:right-0 after:w-1/3 after:h-[2px] after:bg-amber-300 after:content-['']" />
      </p>

      <div className={`${cardBase} p-10 bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 dark:text-white`}>
        <h2 className="mb-6 mt-12 text-center text-4xl font-extrabold tracking-wide">
          Try All-In-One
        </h2>

        <form className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-10 py-6">
          <Field label="Upload PDF File" htmlFor="pdfUpload">
            <input
              id="pdfUpload"
              type="file"
              accept=".pdf"
              className=" hidden"
              onChange={(event) => {
                setFile(event.target.files[0]);
                handleFileUpload(event)
              }}
            />
            <label htmlFor="pdfUpload" className="m-auto">
              {!file && (
                <button
                  type="button"
                  className="bg-[#da4133] font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl"
                  onClick={() => document.getElementById("pdfUpload").click()}
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
            {pages.length > 0 && (
              <PdfPagesViewer
                pages={pages}
                selectedPages={selectedPages}
                onPageToggle={handlePageToggle}
              />
            )}
          </Field>
          <Field label="Enter Prompt Text" htmlFor="promptInput">
            <textarea
              id="promptInput"
              rows={4}
              placeholder="Type your custom prompt..."
              // className="w-full resize-none rounded-md border border-amber-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              className=" w-full border-2 rounded-2xl p-5"
            />
          </Field>
          <Field label="Paste Video URL" htmlFor="videoUrl">
            <input
              id="videoUrl"
              type="url"
              placeholder="https://example.com/video"
              // className="w-full rounded-md border border-amber-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              className=" w-full border-2 rounded-2xl p-5"
            />
          </Field>

          {/* <button className="mt-4 self-center rounded-lg bg-amber-500 px-6 py-2 font-bold text-white shadow-md transition hover:bg-amber-600">
                Generate Unified Quiz
              </button> */}
          <button
            type="submit"
            className="bg-[#da4133]  w-max m-auto font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl"
          >
            Generate
          </button>
        </form>
      </div>
    </section>
  );
};
/**
 * Simple wrapper for label + input children
 */
export const Field = ({ label, htmlFor, children }) => (
  <div className="flex flex-col mb-6 shadow-2xl bg-amber-35 outline-1 outline-blue-50 rounded-2xl p-5">
    <label
      className="pl-10 block mb-5 text-xl font-medium text-amber-700"
      htmlFor={htmlFor}
    >
      {label}
    </label>
    {children}
  </div>
);
