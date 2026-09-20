import { useState } from "react";
export function PrompttoQuiz() {
    return (
        <div className="w-full h-full p-10 flex flex-col justify-center items-center">
            <p className="text-center text-3xl quicksand-normal mt-10">
                Enter a prompt to generate a quiz.
            </p>
            <form action=" " className="flex flex-col w-[50%] m-auto gap-5 p-10 rounded-2xl justify-evenly">   
                <input type="text" name="" id="" className="border-2 rounded-2xl p-5"/>
                <button type="submit" className="bg-[#da4133]  w-max m-auto font-bold pt-2 pl-5 pb-2 pr-5 bg-center text-white cursor-pointer rounded-xl">Generate</button>
            </form>
        </div>
    )}