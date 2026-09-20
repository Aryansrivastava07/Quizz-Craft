import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PdftoQuiz } from "../PdftoQuiz";
import { PrompttoQuiz } from "../PrompttoQuiz";
import { VideotoQuiz } from "../VideotoQuiz";
import {
  faFilePdf,
  faTerminal,
  faVideo,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export const MakeQuiz = () => {
  const [canvas, setCanvas] = useState(null);
  return (
    <>
      <h1 className="mt-20 text-6xl quicksand-normal">Create Your Quiz</h1>
      <div
        className={`${
          canvas ? "h-[70vh] " : "h-[40vh] "
        } w-full max-w-[80vw] mx-auto mt-10 bg-amber-8 rounded-2xl shadow-2xl relative flex items-center transition-all`}
      >
        {canvas && (
          <div
            className="mt-2 ml-5 pl-4 pt-2 pb-2 pr-4 opacity-50 absolute top-0 left-0 z-10 cursor-pointer hover:bg-amber-100 hover:opacity-100 rounded-2xl"
            onClick={() => setCanvas(null)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="" />
          </div>
        )}
        {canvas || <Canvas setCanvas={setCanvas} />}
      </div>
      {!canvas && (
        <div>
          <p className="relative text-center text-4xl text-amber-600 font-semibold before:absolute before:top-1/2 before:left-0 before:w-1/3 before:h-[2px] before:bg-amber-300 before:content-[''] after:absolute after:top-1/2 after:right-0 after:w-1/3 after:h-[2px] after:bg-amber-300 after:content-[''] my-8">
            OR
          </p>
          <div className="w-full max-w-[80vw] p-10 mx-auto mt-10 bg-amber-8 rounded-2xl shadow-2xl">
            <h2 className="text-center text-4xl font-extrabold tracking-wide mt-12 mb-6">
              Try All-In-One
            </h2>
            <form className=" px-10 py-6 flex flex-col gap-8 items-center">
              <div className="w-full max-w-xl">
            
                <label
                  className="block text-lg font-medium text-amber-700 mb-2"
                  htmlFor="pdfUpload"
                >
                  Upload PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  id="pdfUpload"
                  className="w-full border border-amber-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="w-full max-w-xl">
                <label
                  className="block text-lg font-medium text-amber-700 mb-2"
                  htmlFor="promptInput"
                >
                  Enter Prompt Text
                </label>
                <textarea
                  id="promptInput"
                  rows="4"
                  placeholder="Type your custom prompt..."
                  className="w-full border border-amber-300 px-4 py-2 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="w-full max-w-xl">
                <label
                  className="block text-lg font-medium text-amber-700 mb-2"
                  htmlFor="videoUrl"
                >
                  Paste Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  placeholder="https://example.com/video"
                  className="w-full border border-amber-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md"
              >
                Generate Unified Quiz
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
function Canvas({ setCanvas }) {
  return (
    <>
      <div className="w-full h-full flex flex-row gap-36 justify-center items-center">
        {[
          ["PDF to Quiz", faFilePdf, <PdftoQuiz />],
          ["Prompt to Quiz", faTerminal, <PrompttoQuiz />],
          ["Video to Quiz", faVideo, <VideotoQuiz />],
        ].map((text, index) => (
          <button
            type="button"
            className="h-[20vh] w-[20vh] bg-amber-200 hover:bg-amber-300 cursor-pointer rounded-xl flex flex-col justify-center items-center relative"
            onClick={() => setCanvas(text[2])}
            key={index}
          >
            <FontAwesomeIcon icon={text[1]} className="text-5xl" />
            <p className="absolute bottom-8">{text[0]}</p>
          </button>
        ))}
      </div>
    </>
  );
}
