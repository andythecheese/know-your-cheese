let questions = [];
let currentQuestionIndex = 0;

function loadQuiz(filename) {
  fetch(filename)
    .then(response => response.json())
    .then(data => {
      questions = data.questions;
      currentQuestionIndex = 0;

      const cheeseImg = document.getElementById("cheese-img");
      if (data.image) {
        cheeseImg.src = data.image;
      }

      loadQuestion();
    })
    .catch(error => {
      console.error("Error loading quiz:", error);
      document.getElementById("question").innerText = "Failed to load the quiz.";
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
    feedback.innerHTML = current.fact || "✅ Correct!";
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

window.onload = () => {
  loadQuiz("mimolette.json");
};
