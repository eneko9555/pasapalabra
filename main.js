import { questions as questionsArray } from "./questions.js";

let questions;
let currentTurn = 0;
let container = document.querySelector(".container");
let playBtn = document.querySelector(".btn");
let submitBtn = document.querySelector(".submit");
let input = document.querySelector(".input");
let pasapalabraBtn = document.querySelector(".pasapalabra");
let endBtn = document.querySelector(".end");
let question = document.querySelector(".question");
let numberQuestions = document.querySelector(".numberQuestions");
let time = document.querySelector(".time");
let intervalId;
let numbersOfTurns = 0;
let pasapalabras;
let newIndex = 0;
let user;
let ranking = [];
let modal = document.querySelector(".modal");

getRandomQuestions();
function getRandomQuestions() {
  let randomQuestions = [];

  for (let i = 0; i < questionsArray.length; i++) {
    const { letter, answer, question } = questionsArray[i];

    const randomIndex = Math.floor(Math.random() * answer.length);

    randomQuestions.push({
      letter,
      answer: answer[randomIndex],
      status: 0,
      question: question[randomIndex],
    });
  }

  questions = randomQuestions;
}

const turn = () => {
  if (
    input.value.toLowerCase() === questions[currentTurn].answer.toLowerCase()
  ) {
    if (numbersOfTurns <= 27) {
      document
        .querySelector(`.${questions[currentTurn].letter.toUpperCase()}`)
        .classList.add("question_success");
    } else {
      document
        .querySelector(`.${questions[currentTurn].letter.toUpperCase()}`)
        .classList.add("question_success");
    }
    numberQuestions.textContent--;
    questions[currentTurn].status = 1;
  } else if (numbersOfTurns <= 27) {
    document
      .querySelector(`.${questions[currentTurn].letter.toUpperCase()}`)
      .classList.add("question_failure");
    questions[currentTurn].status = -1;
  } else {
    document
      .querySelector(`.${questions[currentTurn].letter.toUpperCase()}`)
      .classList.add("question_failure");
    questions[currentTurn].status = -1;
  }
  currentTurn++;
  return start();
};

const end = () => {
  clearInterval(intervalId);
  submitBtn.classList.add("hidden");
  input.classList.add("hidden");
  pasapalabraBtn.classList.add("hidden");
  endBtn.classList.add("hidden");

  question.innerHTML = `!FIN DEL JUEGO!
    <p>Has conseguido un total de ${
      27 - numberQuestions.textContent
    } preguntas acertadas!</p>
    <p>Termina una partida para poder acceder al ranking!</p>
    <button class="restart submit">Volver a jugar</button>
  `;

  document.querySelector(".restart").addEventListener("click", resetGame);
};

const pasapalabra = () => {
  if (numbersOfTurns <= 27) {
    currentTurn++;
  } else {
    newIndex = questions.findIndex((q, i) => i > currentTurn && q.status === 0);
    currentTurn = newIndex;

    if (newIndex === -1) {
      currentTurn = questions.findIndex((q) => q.status === 0);
    }
    pasapalabras = true;
  }
  return start();
};

const resetGame = () => {
  getRandomQuestions();

  currentTurn = 0;
  numbersOfTurns = 0;
  time.textContent = 150;
  numberQuestions.textContent = 27;
  pasapalabras = false;
  newIndex = 0;
  questions.forEach((q) => (q.status = 0));
  document
    .querySelectorAll(".question_failure")
    .forEach((el) => el.classList.remove("question_failure"));
  document
    .querySelectorAll(".question_success")
    .forEach((el) => el.classList.remove("question_success"));
  return start();
};

const gameOver = () => {
  clearInterval(intervalId);
  submitBtn.classList.add("hidden");
  input.classList.add("hidden");
  pasapalabraBtn.classList.add("hidden");
  endBtn.classList.add("hidden");

  question.innerHTML = `!FIN DEL JUEGO!
    <p>Has conseguido un total de ${
      27 - numberQuestions.textContent
    } preguntas acertadas!</p>
    <input type="text" class="input-rank" placeholder="Escribe tu nombre.." />
    <button class="btn-rank pasapalabra" >Enviar</button>
    <button class="reset pasapalabra" >Volver a jugar</button>
    <button class="btn-seeRank  hidden" >Ver Ranking</button>
  `;
  document.querySelector(".reset").addEventListener("click", resetGame);

  document.querySelector(".btn-rank").addEventListener("click", () => {
    user = document.querySelector(".input-rank").value;
    if (!user)
      return (document.querySelector(".input-rank").placeholder =
        "Escribe un nombre válido");

    document.querySelector(".btn-seeRank").classList.remove("hidden");
    document.querySelector(".btn-rank").classList.add("hidden");

    ranking.push({ user, score: 27 - numberQuestions.textContent });
    ranking.sort((a, b) => b.score - a.score);

    document.querySelectorAll(".row").forEach((row) => row.remove());
    ranking.map((user) => {
      let tr = document.createElement("tr");
      tr.classList.add("row");
      let tdUser = document.createElement("td");
      let tdScore = document.createElement("td");

      tdUser.textContent = user.user;
      tdScore.textContent = user.score;
      tr.appendChild(tdUser);
      tr.appendChild(tdScore);
      document.querySelector(".t-body").appendChild(tr);
    });

    document.querySelector(".btn-seeRank").addEventListener("click", () => {
      modal.classList.remove("modal-exit");
      modal.classList.add("modal-enter");
      container.classList.add("opacity");
      container.classList.add("pointer");
    });
  });
};

const start = () => {
  input.value = "";
  numbersOfTurns++;
  if (questions.every((q) => q.status !== 0)) return gameOver();
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (time.textContent === "0") {
      return gameOver();
    }
    if (time.textContent < 20) {
      time.classList.add("red");
    }
    time.textContent--;
  }, 1000);

  playBtn.classList.add("hidden");
  input.classList.remove("hidden");
  document.querySelector(".flex").classList.remove("hidden");
  document.querySelector(".introduction").classList.add("hidden");
  submitBtn.classList.remove("hidden");
  endBtn.classList.remove("hidden");
  pasapalabraBtn.classList.remove("hidden");

  if (numbersOfTurns > 27) {
    let index = questions.findIndex((q, i) => i > newIndex && q.status === 0);

    if (!newIndex) {
      currentTurn = index;
    }
    if (!pasapalabras) {
      if (index === -1) {
        currentTurn = questions.findIndex((q, i) => q.status === 0);
      } else {
        currentTurn = index;
      }
    }
    question.textContent = questions[currentTurn].question;
  } else {
    question.textContent = questions[currentTurn].question;
  }
  pasapalabras = false;
};

playBtn.addEventListener("click", start);
submitBtn.addEventListener("click", turn);
pasapalabraBtn.addEventListener("click", pasapalabra);
endBtn.addEventListener("click", end);
document.querySelector(".close-modal").addEventListener("click", () => {
  modal.classList.remove("modal-enter");
  modal.classList.add("modal-exit");
  container.classList.remove("opacity");
  container.classList.remove("pointer");
});
