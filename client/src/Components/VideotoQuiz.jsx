import { useState } from "react";
export function VideotoQuiz() {
    return (
        <div className="w-full flex flex-col items-center">
            <h1>Video to Quiz</h1>
            <p>Upload a PDF file to convert it into a quiz.</p>
            <input type="file" accept=".pdf" />
        </div>
    )}