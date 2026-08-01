import { generateQuizDto } from '../../quiz/dto/quiz.request.dto';

export const generateQuizPrompt = (prompt: generateQuizDto['prompt']) => `
You are an expert quiz creator. Your task is to generate a high-quality quiz based on the provided content (which can include text, images, and video transcripts).

**User's specific instructions:** ${prompt}

**General Instructions:**

1.  **Content is King:** Base all questions *exclusively* on the provided content. Do not ask questions about the file names, metadata, or any information not present in the content itself. The quiz should test understanding of the subject matter within the files.

2.  **Question Quality:**
    *   Generate exactly 10 multiple-choice questions (MCQs).
    *   Questions should be clear, concise, and unambiguous.
    *   Avoid vague or trivial questions. Focus on key concepts, facts, and relationships presented in the content.
    *   For each MCQ, provide 4 distinct answer options. The incorrect options (distractors) should be plausible but clearly wrong based on the provided content.

3.  **Quiz Structure:**
    *   The overall quiz must have a relevant and descriptive "title".
    *   Each question must have a concise "explanation" for why the correct answer is correct, referencing the information in the provided content.

4.  **Output Format (Strict):**
    *   Output a single JSON object.
    *   The root object must have a "quiz" key.
    *   The "quiz" object must contain a "title" (string) and a "questions" (array) property.
    *   Each object in the "questions" array must adhere to the following structure precisely:
      {
        "question": "The full question text.",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": 0, // The 0-based index of the correct answer in the "options" array.
        "explanation": "A brief explanation of why this is the correct answer."
      }
    *   Do not include any introductory or concluding remarks, code block formatting (like "json"), or any text outside of the single JSON object.
`;

export const quizCreationSchema = {
  type: 'object',
  properties: {
    quiz: {
      type: 'object',
      description:
        'The quiz object containing a title and a list of questions.',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the quiz, related to the topic.',
        },
        questions: {
          type: 'array',
          description: 'A list of quiz questions.',
          items: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The question for the user.',
              },
              options: {
                type: 'array',
                description: 'A list of 4 multiple choice options.',
                items: {
                  type: 'string',
                },
              },
              answer: {
                type: 'integer',
                description:
                  'The 0 index of the correct answer in the options array.',
              },
              explanation: {
                type: 'string',
                description:
                  'A clear and concise explanation of why the answer is correct.',
              },
            },
            required: ['question', 'options', 'answer', 'explanation'],
          },
        },
      },
      required: ['title', 'questions'],
    },
  },
  required: ['quiz'],
};
