// PdfPagesViewer.js
import {React , useEffect, useState} from "react";

const PdfPagesViewer = ({ pdf , setPdfs}) => {
  const pages = pdf.pages;
  // console.log(pdf);
  const [selectedPages,setSelectedPages] = useState(pdf.selectedPages);

  useEffect(() => {
    // console.log(selectedPages);
    pdf.selectedPages = selectedPages;
    setPdfs((prev) => {
      const updatedPdfs = prev.map((p) => {
        if (p.pdf.name === pdf.pdf.name) {
          return { ...p, selectedPages };
        }
        return p;
      });
      return updatedPdfs;
    });
  }, [selectedPages])
  
  return (
    <div className="flex flex-row gap-4 flex-nowrap mt-10 overflow-x-auto">
      {pages.map((page, idx) => {
        const imageClasses = `w-full h-auto border-2 ${
          selectedPages.includes(page.pageNumber) ? "opacity-100" : "opacity-35"
        }`;

        return (
          <div
            key={`page-image-${idx}`}
            className="flex-shrink-0 flex-grow-0 min-w-[100px] max-w-[150px] cursor-pointer"
            onClick={() => {
              setSelectedPages((prev) =>
                prev.includes(page.pageNumber)
                  ? prev.filter((i) => i !== page.pageNumber)
                  : [...prev, page.pageNumber]
              );
              // console.log(selectedPages.includes(page.pageNumber));
            }}
          >
            <img
              src={page.imageData}
              alt={`Page ${page.pageNumber}`}
              className={imageClasses}
            />
            <p className="text-center">{page.pageNumber}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PdfPagesViewer;
