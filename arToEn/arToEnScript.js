const audioPlayer = new Audio();

// to make the randomly answers
function shuffleOptions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// to make the randomly questions
function shuffleArray(array) {
  const arr = [...array]; // copy to avoid mutating the original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr;
}

let correctAnswers = 0;
let wrongAnswers = 0;

// Reading the questions from JSON file
fetch("arToEnQuestions.json")
  .then((response) => response.json())
  .then((questions) => renderQuiz(questions));

// Function to show the question
function renderQuiz(questions) {
  // Getting the random questions
  const shuffledQuestions = shuffleArray(questions).slice(0, 20);

  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  shuffledQuestions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-container");

    const questionText = document.createElement("p");
    questionText.classList.add("question");
    questionText.innerText = `${index + 1} - ${q.question}`;
    questionDiv.appendChild(questionText);

    // mix the options
    const shuffledOptions = [...q.options];
    shuffleOptions(shuffledOptions);

    shuffledOptions.forEach((option) => {
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");
      answerDiv.innerText = option;

      answerDiv.setAttribute("tabindex", "-1");
      answerDiv.setAttribute("contenteditable", "false");
      answerDiv.style.userSelect = "none";

      answerDiv.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });

      let word = answerDiv.innerText;
      const audioURL = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-us.mp3`;
      answerDiv.onclick = () => {
        audioPlayer.src = audioURL;
        audioPlayer.play();
        selectAnswer(answerDiv, q.answer, option);
      };
      questionDiv.appendChild(answerDiv);
    });

    quizContainer.appendChild(questionDiv);
  });
}

function selectAnswer(answerDiv, correctAnswer, selectedAnswer) {
  // prevent clicking after selecting the option
  const allAnswers = answerDiv.parentElement.querySelectorAll(".answer");
  allAnswers.forEach((ans) => {
    ans.style.pointerEvents = "none"; // prevent clicking
  });

  // select the answer if it is true or false depending on the color
  if (selectedAnswer === correctAnswer) {
    answerDiv.classList.add("correct");
    correctAnswers++;
    document.getElementById("correct-result").innerHTML = "";

    const msg = document.createElement("div");
    msg.textContent = `Correct Questions Number is: ${correctAnswers} of 20 `;

    document.getElementById("correct-result").appendChild(msg);
  } else {
    answerDiv.classList.add("incorrect");
    allAnswers.forEach((ans) => {
      ans.innerText === correctAnswer
        ? ans.classList.add("correct")
        : undefined;
    });
    wrongAnswers++;
    document.getElementById("wrong-result").innerHTML = "";

    const msg = document.createElement("div");
    msg.textContent = `Wrong Questions Number is: ${wrongAnswers} of 20 `;
    document.getElementById("wrong-result").appendChild(msg);
  }
}
