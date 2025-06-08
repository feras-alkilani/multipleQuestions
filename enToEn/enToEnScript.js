const audioPlayer = new Audio();
const audioPlayer1 = new Audio();
const audioPlayer2 = new Audio();
let correctAnswers = 0;
let wrongAnswers = 0;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fetchQuestions() {
  fetch("enToEnQuestions.json")
    .then((res) => res.json())
    .then((questions) => renderQuiz(shuffleArray(questions).slice(0, 20)))
    .catch((err) => console.error("Failed to load questions:", err));
}

function renderQuiz(questions) {
  const wordsArray = questions.map((q) => q.question);
  console.log(wordsArray.join(", ")); // To Show all the words

  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-container");

    // === Question Button ===
    const questionText = document.createElement("button");
    questionText.classList.add("question");
    const word = q.question.toLowerCase();
    const audioURL = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-us.mp3`;
    const audioURL1 = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-uk.mp3`;
    const audioURL2 = `https://ssl.gstatic.com/dictionary/static/sounds/20200429/${word}--_gb_1.mp3`;
    questionText.textContent = `${index + 1} - ${q.question}`;

    questionText.onclick = async () => {
      const tryPlay = (player, url) =>
        new Promise((resolve) => {
          player.pause();
          player.currentTime = 0;
          player.src = url;
          player.oncanplaythrough = () => {
            player.play();
            resolve(true);
          };
          player.onerror = () => {
            console.log(`Audio file not found or can't be played: ${url}`);
            resolve(false);
          };
        });

      if (await tryPlay(audioPlayer, audioURL)) return;
      if (await tryPlay(audioPlayer1, audioURL1)) return;
      if (await tryPlay(audioPlayer2, audioURL2)) return;
      console.log("No valid audio file found.");
    };

    // === Youglish Button ===
    const youglishBtn = document.createElement("button");
    youglishBtn.classList.add("youglish");
    youglishBtn.innerHTML = `<img width="20" height="20" src="../images/brandyg.png" alt="YouGlish" />`;
    youglishBtn.onclick = () => {
      const link = `https://youglish.com/pronounce/${word}/english`;
      window.open(link, "_blank");
    };

    // === Button Container ===
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("questionsButtons");
    buttonsContainer.appendChild(questionText);
    buttonsContainer.appendChild(youglishBtn);
    questionDiv.appendChild(buttonsContainer);

    // === Options ===
    const shuffledOptions = shuffleArray(q.options);
    shuffledOptions.forEach((option) => {
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("answer");
      answerDiv.textContent = option;
      answerDiv.setAttribute("tabindex", "-1");
      answerDiv.setAttribute("contenteditable", "false");
      answerDiv.style.userSelect = "none";
      answerDiv.addEventListener("mousedown", (e) => {
        e.preventDefault();
      });

      answerDiv.onclick = () => handleAnswer(answerDiv, q.answer, option);
      questionDiv.appendChild(answerDiv);
    });

    quizContainer.appendChild(questionDiv);
  });
}

function handleAnswer(answerDiv, correctAnswer, selectedAnswer) {
  const allAnswers = answerDiv.parentElement.querySelectorAll(".answer");
  allAnswers.forEach((el) => (el.style.pointerEvents = "none"));

  if (selectedAnswer === correctAnswer) {
    answerDiv.classList.add("correct");
    correctAnswers++;
    updateResult("correct", correctAnswers);
  } else {
    answerDiv.classList.add("incorrect");
    allAnswers.forEach((el) => {
      if (el.textContent === correctAnswer) el.classList.add("correct");
    });
    wrongAnswers++;
    updateResult("wrong", wrongAnswers);
  }
}

function updateResult(type, count) {
  const element = document.getElementById(
    type === "correct" ? "correct-result" : "wrong-result"
  );
  element.textContent = `${
    type === "correct" ? "Correct" : "Wrong"
  } Questions Number is: ${count} of 20`;
}

// Start the quiz
fetchQuestions();
