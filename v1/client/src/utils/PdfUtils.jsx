// pdfUtils.js
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

export const extractPdfPages = async (pdfData) => {
  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const numPages = pdf.numPages;
    const pages = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      pages.push({
        pageNumber: i,
        imageData: canvas.toDataURL("image/png"),
      });
    }

    return pages;
  } catch (error) {
    console.error("Error extracting PDF pages:", error);
    throw error;
  }
};