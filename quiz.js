// Correct answer for this round
const correctAnswer = "Hard";

function checkAnswer(userAnswer) {
  const feedback = document.getElementById("feedback");
  const cheeseImg = document.getElementById("cheese-img");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");

  if (userAnswer === correctAnswer) {
    feedback.innerHTML = "✅ Correct! Mimolette is a hard cheese.";
    correctSound.play();
    cheeseImg.classList.add("cheese-dance");

    setTimeout(() => {
      cheeseImg.classList.remove("cheese-dance");
    }, 800);
  } else {
    feedback.innerHTML = "❌ Oops! It's actually a hard cheese.";
    wrongSound.play();
  }
}
