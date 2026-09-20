import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PdftoQuiz } from "./PdftoQuiz";
import { PrompttoQuiz } from "./PrompttoQuiz";
import { VideotoQuiz } from "./VideotoQuiz";
import { AllinOneForm } from "./QuizAllinOne";
import {
  faFilePdf,
  faTerminal,
  faVideo,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export const MakeQuiz = () => {
  const [canvas, setCanvas] = useState(null);

  // shared wrapper for both modes
  const cardBase =
    "w-full max-w-[80vw] mx-auto mt-10 bg-amber-8 rounded-2xl shadow-2xl relative transition-all";

  // map of your 3 “pick a mode” buttons
  const modes = [
    { label: "PDF to Quiz", icon: faFilePdf, comp: <PdftoQuiz /> },
    { label: "Prompt to Quiz", icon: faTerminal, comp: <PrompttoQuiz /> },
    { label: "Video to Quiz", icon: faVideo, comp: <VideotoQuiz /> },
  ];
  

  return (
    <>
    <div className=" transition-all duration-150 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950">
      <h1 className="pt-5 text-6xl quicksand-normal text-center text-gray-900 dark:text-white">
        Create Your Quiz
      </h1>

      {/* swipe-in box for single-mode pick or view */}
      <div
        className={`${cardBase} flex items-center bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 ${
          canvas ? "h-[70vh]" : "h-[40vh]"
        }`}
      >
        {canvas && (
          <button
            onClick={() => setCanvas(null)}
            className="absolute top-3 left-3 z-10 px-3 py-2 rounded-xl opacity-50 hover:opacity-100 hover:bg-amber-100 "
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}

        {/* show either the 3-button “canvas” or your chosen canvas */}
        {canvas || (
          <div className="flex w-full h-full justify-center items-center gap-12 ">
            {modes.map(({ label, icon, comp }, i) => (
              <button
                key={i}
                onClick={() => setCanvas(comp)}
                className="flex flex-col items-center justify-center w-[20vh] h-[20vh] bg-amber-200 hover:bg-amber-300 rounded-xl"
              >
                <FontAwesomeIcon icon={icon} className="text-5xl" />
                <span className="mt-2">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* if no canvas is picked, show “OR” + the All-in-One form */}
      {!canvas && (
        <AllinOneForm />
      )}
      </div>
    </>
  );
};


