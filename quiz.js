// Correct answer for this round
const correctAnswer = "Hard";

function checkAnswer(userAnswer) {
  const feedback = document.getElementById("feedback");
  if (userAnswer === correctAnswer) {
    feedback.innerHTML = "✅ Correct! Mimolette is a hard cheese.";
  } else {
    feedback.innerHTML = "❌ Oops! It's actually a hard cheese.";
  }
}
