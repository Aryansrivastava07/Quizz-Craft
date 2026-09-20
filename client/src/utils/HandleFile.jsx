  import PdfPagesViewer from "../Components/PdfPagesViewer";
  import { extractPdfPages } from "./PdfUtils";
  export const handleFileUpload = async ({fileUploaded, setPdfs, setChatMessages}) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileUploaded.file);
    reader.onload = async () => {
      const pdfData = {
        name: fileUploaded.name,
        pdf: fileUploaded.file,
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
        setChatMessages((prev) => [
          ...prev,
          {
            text: "Select pages to generate quiz:",
            content: (
              <PdfPagesViewer
               pdf={pdfData}
               setPdfs={setPdfs}
              />
            ),
          },
        ]);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("Failed to process the PDF. Please try another file.");
      }
    };

    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };
  };