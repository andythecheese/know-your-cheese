let cheeseQueue = [];
let currentCheeseIndex = 0;
let questions = [];
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let score = 0;
let totalQuestions = 0;
let userAnswers = [];

function loadNextCheese() {
  if (currentCheeseIndex >= cheeseQueue.length) {
    showFinalScore();
    return;
  }

  const filename = cheeseQueue[currentCheeseIndex];
  console.log("📦 Fetching cheese quiz file:", filename);

  fetch(filename)
    .then(res => {
      if (!res.ok) throw new Error(`Could not fetch ${filename}`);
      return res.json();
    })
    .then(data => {
      questions = data.questions;
      currentQuestionIndex = 0;
      selectedAnswerIndex = null;

      const img = document.getElementById("cheese-img");
      img.src = data.image || "cheese_quiz.png";
      img.alt = filename.replace(".json", "");

      loadQuestion();
    })
    .catch(err => {
      console.error(err);
      document.getElementById("question").innerText = `Error loading quiz for: ${filename}`;
    });
}

function loadQuestion() {
  const current = questions[currentQuestionIndex];
  document.getElementById("question").innerText = current.question;

  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";
  selectedAnswerIndex = null;

  current.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      selectedAnswerIndex = i;
      updateButtonStyles(i);
      document.getElementById("submit-btn").disabled = false;
    };
    buttonsDiv.appendChild(btn);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("submit-btn").style.display = "inline-block";
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("next-btn").style.display = "none";
}

function updateButtonStyles(selected) {
  const buttons = document.querySelectorAll("#buttons button");
  buttons.forEach((btn, i) => {
    btn.style.backgroundColor = i === selected ? "#fdd835" : "";
  });
}

document.getElementById("submit-btn").onclick = () => {
  if (selectedAnswerIndex === null) return;
  const current = questions[currentQuestionIndex];
  const isCorrect = selectedAnswerIndex === current.answer;
  userAnswers.push({
    cheese: cheeseQueue[currentCheeseIndex],
    question: current.question,
    options: current.options,
    correct: current.answer,
    selected: selectedAnswerIndex
  });

  if (isCorrect) {
    document.getElementById("feedback").textContent = current.fact || "✅ Correct!";
    document.getElementById("correct-sound")?.play();
    document.getElementById("cheese-img")?.classList.add("cheese-dance");
    setTimeout(() => {
      document.getElementById("cheese-img")?.classList.remove("cheese-dance");
    }, 800);
    score++;
  } else {
    document.getElementById("feedback").textContent = "❌ Not quite!";
    document.getElementById("wrong-sound")?.play();
  }

  totalQuestions++;
  document.querySelectorAll("#buttons button").forEach((btn, i) => {
    btn.disabled = true;
    btn.style.backgroundColor =
      i === current.answer
        ? "#c8e6c9"
        : i === selectedAnswerIndex
        ? "#ffcdd2"
        : "";
  });

  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "inline-block";
};

document.getElementById("next-btn").onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    currentCheeseIndex++;
    loadNextCheese();
  }
};

function showFinalScore() {
  document.getElementById("question").textContent = "";
  document.getElementById("buttons").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("cheese-img").src = "cheese_quiz.png";

  document.getElementById("score-container").style.display = "block";
  document.getElementById("final-score").textContent =
    `You scored ${score} out of ${totalQuestions} across ${cheeseQueue.length} cheeses.`;

  localStorage.removeItem("selectedCheeses");
}

function showReview() {
  document.getElementById("review-container").style.display = "block";
  const container = document.getElementById("review-content");
  container.innerHTML = "";

  userAnswers.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "review-question";

    const q = document.createElement("p");
    q.innerHTML = `<strong>Q${i + 1} (${entry.cheese.replace(".json", "")}):</strong> ${entry.question}`;
    div.appendChild(q);

    entry.options.forEach((opt, idx) => {
      const line = document.createElement("p");
      line.textContent = opt;
      if (idx === entry.correct) {
        line.style.color = "green";
        line.style.fontWeight = "bold";
      }
      if (idx === entry.selected && idx !== entry.correct) {
        line.style.color = "red";
        line.style.fontStyle = "italic";
      }
      div.appendChild(line);
    });

    container.appendChild(div);
  });
}

window.onload = () => {
  const img = document.getElementById("cheese-img");
  img.src = "cheese_quiz.png";
  img.alt = "Cheese Quiz";

  const stored = localStorage.getItem("selectedCheeses");
  console.log("🧀 Loaded from localStorage:", stored);

  if (stored) {
    cheeseQueue = JSON.parse(stored);
    console.log("🧀 Cheese queue:", cheeseQueue);

    if (cheeseQueue.length > 0) {
      loadNextCheese();
      return;
    }
  }

  document.getElementById("question").innerText =
    "No cheese selection found. Please return to the home page.";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
};
