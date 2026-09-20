import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { handleGenerate } from "../utils/GenerateQuiz.jsx";
import { useChatPresets } from "./ChatPresets";
import { useQuiz } from "./QuizContext";

export const Input = ({
  setChatMessages,
  pdfs,
  setIsLoading,
}) => {
    const presets = useChatPresets();
    const {
      setQuizData,
      setAnskey,
      uploadedFiles,
      setQuizId
    } = useQuiz();
  return (
    <form className="mx-10 my-2">
      <div className="px-5 flex items-center gap-10">
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
        >
          Add Category
        </button>
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
          onClick={() => {
           setChatMessages((prev) => [...prev, presets["Upload"]]);
          }}
        >
          Add Files
        </button>
        <button
          type="button"
          className="border border-gray-900 dark:border-white p-3 rounded-4xl dark:text-white text-black"
        >
          Add Category
        </button>
      </div>
      <div className="p-5 flex items-center gap-5">
        <input
          type="text"
          className="rounded-4xl w-full p-5 border-2 border-gray-600 dark:border-gray-200 text-gray-900 dark:text-white"
        />
        <button type="button">
          <FontAwesomeIcon
            icon={faArrowRight}
            className="p-5 bg-gray-800 rounded-4xl text-white dark:text-gray-900 dark:bg-slate-300"
            onClick={() => {
              const DatatoSend = {
                pdf: pdfs,
                image: uploadedFiles.image,
                video: uploadedFiles.video,
              };
              handleGenerate({
                uploadedFiles: DatatoSend,
                setQuizData,
                setAnskey,
                setQuizId,
                setIsLoading,
                setChatMessages
              });
            }}
          />
        </button>
      </div>
    </form>
  );
};