let questions = [];
let currentQuestionIndex = 0;

function loadQuiz(filename) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      questions = data;
      currentQuestionIndex = 0;
      loadQuestion();
    });
}

function loadQuestion() {
  const current = questions[currentQuestionIndex];
  document.getElementById("question").innerText = current.question;

  const buttonsContainer = document.getElementById("buttons");
  buttonsContainer.innerHTML = "";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.onclick = () => checkAnswer(index);
    buttonsContainer.appendChild(button);
  });

  document.getElementById("feedback").innerHTML = "";
}

function checkAnswer(userIndex) {
  const feedback = document.getElementById("feedback");
  const cheeseImg = document.getElementById("cheese-img");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");

  const current = questions[currentQuestionIndex];
  const isCorrect = userIndex === current.answer;

  if (isCorrect) {
    feedback.innerHTML = current.fact;
    correctSound.play();
    cheeseImg.classList.add("cheese-dance");
    setTimeout(() => cheeseImg.classList.remove("cheese-dance"), 800);
  } else {
    feedback.innerHTML = "❌ Not quite!";
    wrongSound.play();
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
    } else {
      feedback.innerHTML += "<br>🧀 That’s the end of the quiz!";
    }
  }, 2000);
}

// Kick off the quiz with Mimolette by default
window.onload = () => {
  loadQuiz("mimolette.json");
};
