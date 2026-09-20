import { useChatPresets } from "./ChatPresets";
import { useState } from "react";
// import { useQuiz } from "./QuizContext";

export const Chat = ({ mes, children }) => {
  return (
    <div className="text-gray-900 px-10 py-4 w-[70%] m-5 rounded-2xl bg-gradient-to-bl from-gray-400 to-gray-200 dark:from-gray-700 dark:to-gray-800 dark:text-white shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]">
      <p>{mes}</p>
      {children}
    </div>
  );
};

export const AddChatBubble = ({ setChatMessages, Preset }) => {
  const presets = useChatPresets();
  setChatMessages((prev) => [...prev, presets[Preset]]);
//   console.log(presets);
};
