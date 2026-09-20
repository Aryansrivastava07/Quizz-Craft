const QuizData = [
  {
    question: "In 2021, how many games did Chess.com members play in total?",
    options: ["Over 5 billion", "Over 5 million", "Over 5 thousand", "Over 5 hundred"],
    correct_answer: 0,
  },
  {
    question: "According to the report, how many games were played by the user in 2021?",
    options: ["51%", "598", "36", "6"],
    correct_answer: 1,
  },
  {
    question: "What percentage of the user's games in 2021 were won?",
    options: ["45%", "4%", "51%", "92%"],
    correct_answer: 2,
  },
  {
    question: "What percentage of the user's games in 2021 were lost?",
    options: ["4%", "51%", "92%", "45%"],
    correct_answer: 3,
  },
  {
    question: "What percentage of the user's games in 2021 were drawn?",
    options: ["45%", "51%", "92%", "4%"],
    correct_answer: 3,
  },
  {
    question: "What was the user's best active streak in days?",
    options: ["6 days", "598 days", "92 days", "36 days"],
    correct_answer: 3,
  },
  {
    question: "Compared to other players, how does the user's best active streak rank?",
    options: ["Shorter than 8%", "Longer than 8%", "Shorter than 92%", "Longer than 92%"],
    correct_answer: 3,
  },
  {
    question: "What is the name of the person the user played the most games against in 2021?",
    options: ["Gmail", "Chess.com", "shaurya01234", "Unknown"],
    correct_answer: 2,
  },
  {
    question: "How many games did the user play against shaurya01234 in 2021?",
    options: ["36", "598", "92", "6"],
    correct_answer: 3,
  },
  {
    question: "The report is from which year?",
    options: ["2022", "2023", "2020", "2021"],
    correct_answer: 3,
  }
];

// 🔍 Extracted modules for direct use
export const Questions = QuizData.map((q) => q.question);
export const Options = QuizData.map((q) => q.options);
export const Answers = QuizData.map((q) => q.correct_answer);
export default QuizData;