// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-pro";
  const API_KEY = process.env.GEMINIAPIKEY;
  
  async function run(content, difficultyLevel,promptType ) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    if(promptType == 1){
      // const parts = [
      //   {text: `Create a 10-question multiple-choice quiz based on  following topic, if difficulty level of question is measured from 1-3 where \ndifficulty 1 means easy. Questions should be straightforward and Its answer should be one word.\ndifficulty 2 means moderate and should be tougher than previous difficulty and less than next difficulty. It should be mix of both difficulty.\ndifficulty 3 means harder and questions should not be straightforward and option can be of a sentence.\n\nthen target difficulty level of question is  ${difficultyLevel}.\n\nTopic of quiz is given below:\n\n\ ${content}\n\n\n\nQuestion Should Strictly be based on Above Topic.\nPlease provide the questions in JSON format with each question having the following fields: question, options, answer and explanation to why answer is correct. The options should be an array of four choices, and the answer should be the index of the correct answer within the options array.\nUse single inverted comma to highlight any part in questions and option. So, it does not interfere with  JSON format.\nFormat of JSON object should be :   \n""title": "title of the quiz ",\n questions": [\n            {\n              "question": \\\"requested question\\\",\n              "options": \\\"array of options(do not use any single or double inverted comma here)\\\",\n              "answer": \\\"index of correct answer in options array\\\"\n\t\t\t  "explanation":\\\"explain the reason why answer is correct\\\"\n           }\n          ]\n    };\n Do not write json at the start of the answer. Strictly follow the pattern suggested. Do not give anything which hinders the json format. No semi colons at end strictly`}
      // ];
      const parts = [
      {text:
      `Create a 10-question multiple-choice quiz based on the following topic, with a difficulty level measured from 1-3, where:
Difficulty 1: Easy questions, straightforward, and with one-word answers.
Difficulty 2: Moderate questions, tougher than difficulty 1 but easier than difficulty 3, and can include a mix of simple and complex queries.
Difficulty 3: Harder questions, not straightforward, with options that can be full sentences.
The target difficulty level of questions is ${difficultyLevel}.
Topic of the quiz: ${content}
The questions should be strictly based on the above topic.
Please provide the questions in JSON format with each question having the following fields: question, options. The options should be an array of four choices
.Give the answers array containing index of all correct answers.
  Also give explanations array explaining the answers.
  Do not write json at the start of the answer. Strictly follow the pattern suggested.
  Do not give anything which hinders the json format. No semi colons at end strictly.

Format of JSON object:

{
  "title": "Title of the quiz // should be the same as the topic",
  "questions": [
    {
      "question": "Requested question",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ]
    }
  ],
  "answers": [
    2,
    1,
    3,
    // indices of correct answers for each question
  ],
  "explanations": [
    "Explanation for the correct answer of question 1.",
    "Explanation for the correct answer of question 2.",
    "Explanation for the correct answer of question 3.",
    // explanations corresponding to each question
  ]
}
Use single inverted commas to highlight any part in questions and options so it does not interfere with the JSON format. Ensure there are no semicolons at the end. Recheck your JSON format to avoid any hindrances.`
    }    
];

      const result = await model.generateContent({
        contents: [{ role: "user", parts}],
        generationConfig,
        safetySettings,
      });
    
      const response = result.response;
      let responseText = response.text().replace(/```/g, '');
      responseText = responseText.replace(/json/g, '');
      console.log(responseText);
      const JSONResponse = JSON.parse(responseText); 
      return(JSONResponse);
    }else{
      // const parts = [
      //   {text: `Create a 10-question multiple-choice quiz based on the following text passage, if difficulty level of question is measured from 1-3 where \ndifficulty 1 means easy. Questions should be straightforward and Its answer should be one word.\ndifficulty 2 means moderate and should be tougher than previous difficulty and less than next difficulty. It should be mix of both difficulty.\ndifficulty 3 means harder and questions should not be straightforward and option can be of a sentence. Model can add question from its own knowledge related to topic in content.\n\nthen target difficulty level of question is  ${difficultyLevel}.\n\nContent of quiz is:\n\n${content}\n\nPlease provide the questions in JSON format with each question having the following fields: question, options, answer and explanation to why answer is correct. The options should be an array of four choices, and the answer should be the index of the correct answer within the options array.\nUse single inverted comma to highlight any part in questions and option. So, it does not interfere with  JSON format.\nFormat of JSON object should be :   \n"title": "title of the quiz ",\n "questions":[\n            {\n              "question": \\\"requested question\\\",\n              "options": \\\"array of options(do not use any single or double inverted comma here)\\\",\n              "answer": \\\"index of correct answer in options array\\\"\n\t\t\t  "explanation":\\\"explain the reason why answer is correct\\\"\n           }\n          ]\n    };\n Do not write json at the start of the answer. Strictly follow the pattern suggested. Do not give anything which hinders the json format. No semi colons`}
      // ];
      const parts = [
        {text:
        `Create a 10-question multiple-choice quiz based on the following passage, with a difficulty level measured from 1-3, where:
  Difficulty 1: Easy questions, straightforward, and with one-word answers.
  Difficulty 2: Moderate questions, tougher than difficulty 1 but easier than difficulty 3, and can include a mix of simple and complex queries.
  Difficulty 3: Harder questions, not straightforward, with options that can be full sentences.
  The target difficulty level of questions is ${difficultyLevel}.
  Passage for the quiz: ${content}

  The questions should be strictly based on the above passage, with the topic chosen wisely based on the content.

  Please provide the questions in JSON format with each question having the following fields: question, options. 
  The options should be an array of four choices.Give the answers array containing index of all correct answers seperately.
  Also give explanations array explaining the answers.
  Do not write json at the start of the answer. Strictly follow the pattern suggested.
  Do not give anything which hinders the json format. No semi colons at end strictly.
  Follow the JSON format given below stricly mapping every this at corrext places.:
  Format of JSON object:
  {
    "title": "Title of the quiz // should be the same as the topic",
    "questions": [
      {
        "question": "Requested question",
        "options": [
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4"
        ]
      }
    ],
    "answers": [
      2,
      1,
      3,
      // indices of correct answers for each question
    ],
    "explanations": [
      "Explanation for the correct answer of question 1.",
      "Explanation for the correct answer of question 2.",
      "Explanation for the correct answer of question 3.",
      // explanations corresponding to each question
    ]
  }
  Use single inverted commas to highlight any part in questions and options so it does not interfere with the JSON format. Ensure there are no semicolons at the end. Recheck your JSON format to avoid any hindrances.`
      }    
  ];
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });
    
      const response = result.response;
      let responseText = response.text().replace(/```/g, '');
      responseText = responseText.replace(/json/g, '');
      console.log(responseText);
      const JSONResponse = JSON.parse(responseText); 
      return(JSONResponse);
    }
  }
  
module.exports = run;