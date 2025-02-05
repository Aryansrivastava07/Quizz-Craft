const modal = document.querySelector(".modal");
// Parse the quiz data
const quiz = JSON.parse(getQuiz);
// console.log(quiz);
const questions = quiz.questions;
const questionBody = document.querySelector(".question");
const optionBody = document.querySelector(".option_container");
const questionList = document.querySelector(".question_list");
const questionLength = questions.length;
// Initialize choices array
let choice = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
// Event listener to open modal
document.getElementById("open_modal").addEventListener("click", () => {
  modal.showModal();
});
// Event listener to close modal
document.getElementById("close_modal").addEventListener("click", () => {
  modal.close();
});
// Add click event to each option
var options = document.querySelectorAll(".option");
options.forEach((element) => {
  element.addEventListener("click", () => {
    element.querySelector("input").checked = true;
  });
});
// Create question list items
let j = 1;
while (j <= questionLength) {
  let a = document.createElement("a");
  a.innerHTML = `<div data="unanswered" class="question_list_item">${j}</div>`;
  questionList.appendChild(a);
  j++;
}
// Initialize the first question
nextQuestion(0);
// Event listener for next button
document.getElementById("next_btn").addEventListener("click", (e) => {
  e.preventDefault();
  let i = parseInt(questionBody.children[1].getAttribute("data"));
  nextQuestion(i + 1);
});
// Function to display the next question
function nextQuestion(i) {
  questionList.children[i].children[0].setAttribute("data", "active");
  let prevQuesInd =
    parseInt(questionBody.children[1].getAttribute("data")) || 0;
  if (prevQuesInd != i) {
    getChoice(prevQuesInd);
    handleQuestionList(prevQuesInd);
  }
  if (i + 1 == questionLength) {
    document.getElementById("next_btn").style.display = "none";
  } else document.getElementById("next_btn").style.display = "block";

  questionBody.children[0].innerText = `Question ${i + 1}`;
  questionBody.children[1].innerText = `${questions[i].question}`;
  questionBody.children[1].setAttribute("data", i);
  for (let j = 0; j < questions[i].options.length; j++) {
    optionBody.children[j].children[1].innerText = questions[i].options[j];
    optionBody.children[j].children[0].checked = false;
  }
  if (choice[i] != 4) {
    optionBody.children[choice[i]].children[0].checked = true;
  }
}

// Add click event to each question list item
const questionListItems = document.querySelectorAll(".question_list_item");
questionListItems.forEach((element, index) => {
  element.addEventListener("click", () => {
    i = index;
    nextQuestion(index);
  });
});
// Function to handle question list status
function handleQuestionList(k) {
  document.querySelectorAll(".option").forEach((element) => {
    if (element.querySelector("input").checked) {
      questionList.children[k].children[0].setAttribute("data", "answered");
    }
  });
  if (questionList.children[k].children[0].getAttribute("data") != "answered") {
    questionList.children[k].children[0].setAttribute("data", "unanswered");
  }
}
// Function to get the selected choice
function getChoice(k) {
  let temp = choice.length;
  document.querySelectorAll(".option").forEach((element) => {
    if (element.querySelector("input").checked) {
      choice[k] = parseInt(element.querySelector("input").value);
    }
  });
}

async function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("quiz");
  let i = parseInt(questionBody.children[1].getAttribute("data"));
  getChoice(i);
  const formData = new FormData(form);
  formData.delete('answer');
  const formObject = {}; 
  formData.forEach((value, key) => { formObject[key] = value; });
  formObject.arrayData = choice;

  try {
    const response = await fetch(`https://quizzifypdf.onrender.com/ques?id=${quiz.quizId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObject),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    // console.log('Fetch response:', result);

    // Redirect to the score page
    window.location.href = `/score?id=${quiz.quizId}&r=${result.resultId}`;
  } catch (error) {
    console.error("Error:", error);
  }
}
