import { SVG } from "./svg.js";

let numberOfMoves;
let score = {
  cross: { score: 0, element: document.querySelector(".cross-score") },
  nought: {
    score: 0,
    element: document.querySelector(".nought-score"),
  },
};
let currentFigure = "cross";
let gameFinished;
let gamemode;
let playerMove;
const fields = document.querySelectorAll(".field");

function handleFieldClick(event) {
  if (!event.target.dataset.value) return;
  if (!event.target.dataset.value === "empty") return;
  if (gameFinished) return;
  if (gamemode === "pvcx" || gamemode === "pvco")
    playerMove = !playerMove;
  event.target.append(SVG[currentFigure].cloneNode(true));
  event.target.dataset.value = currentFigure;
  numberOfMoves++;
  console.log(numberOfMoves);
  for (let comb of gameCombinations[currentFigure]) {
    if (
      fields[comb[0]].dataset.value === fields[comb[1]].dataset.value &&
      fields[comb[1]].dataset.value === fields[comb[2]].dataset.value &&
      fields[comb[0]].dataset.value !== "empty"
    ) {
      fields[comb[0]].classList.toggle("win");
      fields[comb[1]].classList.toggle("win");
      fields[comb[2]].classList.toggle("win");
      gameFinished = true;
      score[currentFigure].score++;
      score[currentFigure].element.textContent =
        score[currentFigure].score;
    }
  }
  if (numberOfMoves > 8) {
    gameFinished = true;
  }
  if (gameFinished) {
    document.querySelector(`[data-action="restart"]`).className =
      "highlight";
    return;
  }
  if (currentFigure === "cross") {
    currentFigure = "nought";
  } else {
    currentFigure = "cross";
  }
  gameCombinations[currentFigure] = gameCombinations[
    currentFigure
  ].filter(
    (combination) => !combination.includes(Number([event.target.id]))
  );
  if ((gamemode === "pvcx" || gamemode === "pvco") && playerMove) {
    if (numberOfMoves < 2) {
      fields[chooseFirstMove()].click();
    } else {
      fields[chooseField()].click();
    }
  }
}
const gameboard = document.querySelector(".gameboard");
gameboard.addEventListener("click", handleFieldClick);

const allWinCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let crossWinCombinations = [];
let noughtWinCombinations = [];
let gameCombinations = {};

function gameInit() {
  crossWinCombinations = [];
  noughtWinCombinations = [];
  for (let combination of allWinCombinations) {
    crossWinCombinations.push([...combination]);
    noughtWinCombinations.push([...combination]);
  }
  gameCombinations.cross = crossWinCombinations;
  gameCombinations.nought = noughtWinCombinations;
  currentFigure = "cross";
  numberOfMoves = 0;
  gameFinished = false;
  for (let field of fields) {
    field.dataset.value = "empty";
    field.textContent = "";
    field.className = "field";
  }
  if (gamemode === "pvco") {
    playerMove = true;
    fields[chooseFirstMove()].click();
  } else if (gamemode === "pvcx") {
    playerMove = false;
  }
}

function chooseField() {
  for (let combination of gameCombinations[currentFigure]) {
    let completeness = 0;
    for (let adress of combination) {
      if (fields[adress].dataset.value === currentFigure) {
        completeness++;
      }
    }
    if (completeness === 2) {
      for (let adress of combination) {
        if (fields[adress].dataset.value === "empty") {
          console.log("First");
          return adress;
        }
      }
    }
  }
  let key;
  if (currentFigure === "cross") {
    key = "nought";
  } else {
    key = "cross";
  }
  for (let combination of gameCombinations[key]) {
    let completeness = 0;
    for (let adress of combination) {
      if (fields[adress].dataset.value === key) {
        completeness++;
      }
    }
    if (completeness === 2) {
      for (let adress of combination) {
        if (fields[adress].dataset.value === "empty") {
          console.log("second");
          return adress;
        }
      }
    }
  }
  if (gameCombinations[currentFigure].length) {
    let attractiveness = new Array(9).fill(0);
    let maxValue = 0;
    let index = 0;
    for (let combination of gameCombinations[currentFigure]) {
      for (let adress of combination) {
        if (fields[adress].dataset.value === "empty") {
          attractiveness[adress]++;
        }
      }
    }
    for (let i = 0; i < attractiveness.length; i++) {
      if (maxValue < attractiveness[i]) {
        maxValue = attractiveness[i];
        index = i;
      }
    }
    console.log("third");
    return index;
  }
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].dataset.value === "empty") {
      console.log("fourth");
      return i;
    }
  }
}

function chooseFirstMove() {
  let addressFirstMove = Math.ceil(Math.random() * 9) - 1;
  while (fields[addressFirstMove].dataset.value !== "empty") {
    addressFirstMove = Math.ceil(Math.random() * 9) - 1;
  }
  return addressFirstMove;
}

const chooseGamemode = document.querySelector(".choose-gamemode");
const chooseFigure = document.querySelector(".choose-figure");
const game = document.querySelector(".game");

const container = document.querySelector(".container");
container.addEventListener("click", handleButtons);

function handleButtons(event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  switch (action) {
    case "pvp":
      chooseGamemode.classList.toggle("hidden");
      game.classList.toggle("hidden");
      gameInit();
      break;
    case "pvc":
      chooseGamemode.classList.toggle("hidden");
      chooseFigure.classList.toggle("hidden");
      break;
    case "cross":
      chooseFigure.classList.toggle("hidden");
      game.classList.toggle("hidden");
      gamemode = "pvcx";
      gameInit();
      break;
    case "nought":
      chooseFigure.classList.toggle("hidden");
      game.classList.toggle("hidden");
      gamemode = "pvco";
      gameInit();
      break;
    case "main-menu":
      game.classList.toggle("hidden");
      chooseGamemode.classList.toggle("hidden");
      gamemode = null;
      document.querySelector(`[data-action="restart"]`).className = "";
      for (let key in score) {
        score[key].score = 0;
        score[key].element.textContent = 0;
      }
      break;
    case "restart":
      actionElement.className = "";
      gameInit();
      break;
  }
}
