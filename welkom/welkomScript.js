const audioPlayer = new Audio();
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
  fetch("welkomQuestions.json")
    .then((res) => res.json())
    .then((questions) => renderQuiz(shuffleArray(questions).slice(0, 20)))
    .catch((err) => console.error("Failed to load questions:", err));
}

function renderQuiz(questions) {
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
    questionText.textContent = `${index + 1} - ${q.question}`;
    questionText.onclick = () => {
      audioPlayer.src = audioURL;
      audioPlayer.play();
    };

    // === Youglish Button ===
    const youglishBtn = document.createElement("button");
    youglishBtn.classList.add("youglish");
    youglishBtn.innerHTML = `<img width="20" height="20" src="../images/brandyg.png" alt="YouGlish" />`;
    youglishBtn.onclick = () => {
      const link = `https://youglish.com/pronounce/${word}/dutch`;
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
        e.preventDefault(); // يمنع التركيز وظهور المؤشر
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

// Start the quiz
fetchQuestions();
