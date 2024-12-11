const questionBody = document.querySelector(".question");
const optionBody = document.querySelector(".option_container");
const questionList = document.querySelector(".question_list");
const questionLength = getQues.length;

let j = 1;
while (j <= questionLength) {
  let a = document.createElement("a");
  if (getUserAns[j - 1] === 4) {
    a.innerHTML = `<div data="unanswered" class="question_list_item">${j}</div>`;
  }
  if (getUserAns[j - 1] === getAns[j - 1]) {
    a.innerHTML = `<div data="correct" class="question_list_item">${j}</div>`;
  } else {
    a.innerHTML = `<div data="wrong" class="question_list_item">${j}</div>`;
  }
  questionList.appendChild(a);
  j++;
}
getQuestion(0);

document.getElementById("next_btn").addEventListener("click", (e) => {
  e.preventDefault();
  let i = parseInt(questionBody.children[1].getAttribute("data"));
  getQuestion(i + 1);
});
document.getElementById("prev_btn").addEventListener("click", (e) => {
  e.preventDefault();
  let i = parseInt(questionBody.children[1].getAttribute("data"));
  getQuestion(i - 1);
});

function getQuestion(i) {
  if (i + 1 == questionLength) {
    document.getElementById("next_btn").style.display = "none";
  } else document.getElementById("next_btn").style.display = "block";
    if (i == 0) {
        document.getElementById("prev_btn").style.display = "none";
    } else document.getElementById("prev_btn").style.display = "block";
  questionBody.children[0].innerText = `Question ${i + 1}`;
  questionBody.children[1].innerText = `${getQues[i].question}`;
  questionBody.children[1].setAttribute("data", i);
  for (let j = 0; j < getQues[i].options.length; j++) {
    optionBody.children[j].children[1].innerText = getQues[i].options[j];
    optionBody.children[j].children[0].setAttribute("data-set", "");
    optionBody.children[j].children[0].checked = false;
  }
  if (getUserAns[i] != 4) {
    optionBody.children[getUserAns[i]].children[0].checked = true;
  }
  optionBody.children[getAns[i]].children[0].setAttribute("data-set", "correct");
  setExplanation(i);
}

const questionListItems = document.querySelectorAll(".question_list_item");
questionListItems.forEach((element, index) => {
  element.addEventListener("click", () => {
    i = index;
    getQuestion(index);
  });
});
function setExplanation(i) {
  document.querySelector(".explanation").children[1].innerText = getExpl[i];
}

