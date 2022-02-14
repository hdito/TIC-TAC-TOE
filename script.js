const crossSVG = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
const crossPath = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path"
);
crossSVG.setAttribute("fill", "none");
crossSVG.setAttribute("viewBox", "0 0 24 24");
crossPath.setAttribute(
  "d",
  "M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
);
crossPath.setAttribute("fill", "#0D0D0D");
crossSVG.appendChild(crossPath);

const noughtSVG = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);
const noughtPath = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path"
);
noughtSVG.setAttribute("fill", "none");
noughtSVG.setAttribute("viewBox", "0 0 24 24");
noughtPath.setAttribute(
  "d",
  "M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
);
noughtPath.setAttribute("fill", "#0D0D0D");
noughtSVG.appendChild(noughtPath);
const SVG = { cross: crossSVG, nought: noughtSVG };
let numberOfMoves;

let score = { cross: 0, nought: 0 };
let turnFigure;
let pressedField;
let gameFinished;
let playerChoice;
const scoreElement = document.querySelector(".score");

const crossScoreElement = document.querySelector(".score>div>div");
const noughtScoreElement = document.querySelector(
  ".score>div:nth-child(2)>div"
);

function showScore() {
  crossScoreElement.textContent = score.cross;
  noughtScoreElement.textContent = score.nought;
}

const fields = [];
const fieldElements = document.querySelectorAll(".field");
const resultElement = document.querySelector(".result");
const restartButton = document.querySelector("button");

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
  for (combination of allWinCombinations) {
    crossWinCombinations.push([...combination]);
    noughtWinCombinations.push([...combination]);
  }
  gameCombinations.cross = crossWinCombinations;
  gameCombinations.nought = noughtWinCombinations;
  turnFigure = "cross";
  numberOfMoves = 0;
  gameFinished = false;
  for (let i = 0; i < 9; i++) {
    fields[i] = "empty";
  }
}

function chooseField() {
  for (let combination of gameCombinations[turnFigure]) {
    let completeness = 0;
    for (adress of combination) {
      if (fields[adress] === turnFigure) {
        completeness++;
      }
    }
    if (completeness === 2) {
      for (adress of combination) {
        if (fields[adress] === "empty") {
          console.log("First");
          return adress;
        }
      }
    }
  }
  for (key in gameCombinations) {
    if (key !== turnFigure) {
      for (combination of gameCombinations[key]) {
        let completeness = 0;
        for (adress of combination) {
          if (fields[adress] === key) {
            completeness++;
          }
        }
        if (completeness === 2) {
          for (adress of combination) {
            if (fields[adress] === "empty") {
              console.log("second");
              return adress;
            }
          }
        }
      }
    }
  }
  if (gameCombinations[turnFigure].length) {
    let attractiveness = new Array(9).fill(0);
    let maxValue = 0;
    let index = 0;
    for (combination of gameCombinations[turnFigure]) {
      for (adress of combination) {
        if (fields[adress] === "empty") {
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
    if (fields[i] === "empty") {
      console.log("fourth");
      return i;
    }
  }
}

function computerMakeMove(adress) {
  let temp = turnFigure;
  fields[adress] = turnFigure;
  if (turnFigure === "cross") {
    turnFigure = "nought";
  } else {
    turnFigure = "cross";
  }
  gameCombinations[turnFigure] = gameCombinations[turnFigure].filter(
    (combination) => !combination.includes(Number(adress))
  );

  if (numberOfMoves > 4) {
    for (let combination of gameCombinations[temp]) {
      if (
        fields[combination[0]] === fields[combination[1]] &&
        fields[combination[1]] === fields[combination[2]] &&
        fields[combination[0]] === temp
      ) {
        console.log(`${temp} win!`);
        for (let index of combination) {
          fieldElements[index].classList.add("win");
        }
        gameFinished = true;
        fieldElements[adress].appendChild(SVG[temp].cloneNode(true));
        score[temp]++;
        showScore();
        return;
      }
    }
  }
  fieldElements[adress].appendChild(SVG[temp].cloneNode(true));
}

const reset = () => {
  for (let i = 0; i < 9; i++) {
    fields[i] = "empty";
    fieldElements[i].textContent = "";
    fieldElements[i].classList = "field";
  }
  gameInit();
};

restartButton.addEventListener("click", reset);

function chooseFirstMove() {
  let addressFirstMove = Math.ceil(Math.random() * 9) - 1;
  while (fields[addressFirstMove] !== "empty") {
    addressFirstMove = Math.ceil(Math.random() * 9) - 1;
  }
  return addressFirstMove;
}

const chooseModeScreen = document.querySelector(".choose-mode");
const chooseFigureScreen = document.querySelector(".choose-figure");
const gameScreen = document.querySelector(".game");
const observer = new MutationObserver(computerController);
const observerOptions = {
  childList: true,
  subtree: true,
};
chooseModeScreen.children[0].addEventListener("click", function () {
  chooseModeScreen.classList.toggle("hidden");
  gameScreen.classList.toggle("hidden");
  gameInit();
  for (let field of fieldElements) {
    field.addEventListener("click", playerVersusPlayerController);
  }
});
chooseModeScreen.children[1].addEventListener("click", function () {
  chooseModeScreen.classList.toggle("hidden");
  chooseFigureScreen.classList.toggle("hidden");
  for (child of chooseFigureScreen.children) {
    child.addEventListener("click", pvcInit);
  }
});

function pvcInit(choice) {
  let choiceElement = choice.target;
  while (choiceElement.nodeName !== "DIV") {
    choiceElement = choiceElement.parentElement;
  }
  playerChoice = choiceElement.classList.value;
  if (playerChoice !== "cross") {
    scoreElement.children[0].classList.toggle("blue");
    scoreElement.children[0].classList.toggle("orange");
    scoreElement.children[1].classList.toggle("blue");
    scoreElement.children[1].classList.toggle("orange");
  }
  chooseFigureScreen.classList.toggle("hidden");
  gameScreen.classList.toggle("hidden");
  gameInit();
  for (let field of fieldElements) {
    field.addEventListener("click", playerVersusPlayerController);
  }

  observer.observe(
    document.querySelector(".gameboard"),
    observerOptions
  );
  computerController();
}

function computerController() {
  if (turnFigure === playerChoice || numberOfMoves > 8) {
    return;
  }
  numberOfMoves++;
  console.log(numberOfMoves);
  let adress;
  if (numberOfMoves < 3) {
    adress = chooseFirstMove();
  } else adress = chooseField();

  computerMakeMove(adress);
}

function endController() {
  if (numberOfMoves > 4) {
    for (let combination of gameCombinations[turnFigure]) {
      console.log(combination);
      if (
        fields[combination[0]] === fields[combination[1]] &&
        fields[combination[1]] === fields[combination[2]] &&
        fields[combination[0]] === turnFigure
      ) {
        console.log(`${turnFigure} win!`);
        for (let adress of combination) {
          fieldElements[adress].classList.add("win");
        }
        gameFinished = true;
        score[turnFigure]++;
        showScore();
        return;
      } else if (numberOfMoves === 9) {
        gameFinished = true;
        return;
      }
    }
  }
  if (turnFigure === "cross") {
    turnFigure = "nought";
  } else {
    turnFigure = "cross";
  }
  console.log(gameCombinations);
  gameCombinations[turnFigure] = gameCombinations[turnFigure].filter(
    (combination) => !combination.includes(Number(pressedField))
  );
}

function playerVersusPlayerController(event) {
  pressedField = event.target.getAttribute("id");
  if (fields[pressedField] !== "empty" || gameFinished) {
    return;
  }
  numberOfMoves++;
  console.log(numberOfMoves);

  fields[pressedField] = turnFigure;
  let temp = turnFigure;
  endController();
  fieldElements[pressedField].appendChild(SVG[temp].cloneNode(true));
}

const mainMenuButton = document.querySelectorAll("button")[1];
mainMenuButton.addEventListener("click", function () {
  chooseModeScreen.classList.toggle("hidden");
  gameScreen.classList.toggle("hidden");
  for (let field of fieldElements) {
    field.removeEventListener("click", playerVersusPlayerController);
  }
  observer.disconnect();
  for (let key in score) {
    score[key] = 0;
  }
  showScore();
  if (scoreElement.children[0].classList.contains("orange")) {
    scoreElement.children[0].classList.toggle("blue");
    scoreElement.children[0].classList.toggle("orange");
    scoreElement.children[1].classList.toggle("blue");
    scoreElement.children[1].classList.toggle("orange");
  }
  reset();
});
