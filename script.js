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

let numberOfMoves = 0;

let crossesScore = 0;
let noughtsScore = 0;

const computerScore = document.querySelector(".score>div>div");
const playerScore = document.querySelector(
  ".score>div:nth-child(2)>div"
);
function showScore() {
  computerScore.textContent = crossesScore;
  playerScore.textContent = noughtsScore;
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

let computerWinCombinations = [];
let playerWinCombinations = [];

for (combination of allWinCombinations) {
  computerWinCombinations.push([...combination]);
  playerWinCombinations.push([...combination]);
}

function chooseField() {
  for (let combination of computerWinCombinations) {
    let completeness = 0;
    for (adress of combination) {
      if (fields[adress].content === "cross") {
        completeness++;
      }
    }
    if (completeness === 2) {
      for (adress of combination) {
        if (fields[adress].content === "empty") return adress;
      }
    }
  }
  for (combination of playerWinCombinations) {
    let completeness = 0;
    for (adress of combination) {
      if (fields[adress] === "nought") {
        completeness++;
      }
    }
    if (completeness === 2) {
      for (adress of combination) {
        if (fields[adress] === "empty") {
          return adress;
        }
      }
    }
  }
  if (computerWinCombinations.length) {
    let attractiveness = new Array(9).fill(0);
    let maxValue = 0;
    let index = 0;
    for (combination of computerWinCombinations) {
      for (adress of combination) {
        if (fields[adress].content === "empty") {
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
    return index;
  }
  for (let i = 0; i < fields.length(); i++) {
    if (fields[i].content === "empty") {
      return i;
    }
  }
}

function computerMakeMove(adress) {
  console.log(fieldElements, adress);
  fieldElements[adress].appendChild(crossSVG.cloneNode(true));
  fields[adress].content = "cross";
  playerWinCombinations = playerWinCombinations.filter(
    (combination) => !combination.includes(adress)
  );
}

function playerMakeMove(event) {
  const pressedField = event.target.getAttribute("id");
  console.log(fields[pressedField]);
  if (fields[pressedField].content !== "empty") {
    return;
  }
  fields[pressedField].content = "nought";
  fieldElements[pressedField].appendChild(noughtSVG.cloneNode(true));
  computerWinCombinations = computerWinCombinations.filter(
    (combination) => !combination.includes(pressedField)
  );
  numberOfMoves++;
}

const reset = () => {
  numberOfMoves = 0;

  for (let i = 0; i < 9; i++) {
    fields[i].content = "empty";
    fieldElements[i].textContent = "";
    fieldElements[i].classList = "field";
    fieldElements[i].addEventListener("click", playerMakeMove);
  }
  for (let i = 0; i < allWinCombinations.length; i++) {
    computerWinCombinations[i] = [...allWinCombinations[i]];
    playerWinCombinations[i] = [...allWinCombinations[i]];
  }
};

restartButton.addEventListener("click", reset);
function chooseFirstMove() {
  const addressOfFirstMove = Math.ceil(Math.random() * 9) - 1;
  return addressOfFirstMove;
}
for (let i = 0; i < 9; i++) {
  fields[i] = { winCombinations: [] };
  fields[i].content = "empty";
  for (combination of allWinCombinations) {
    fields[i].winCombinations.push([...combination]);
  }
}

for (let field of fieldElements) {
  field.addEventListener("click", playerMakeMove);
}

function checkForWin() {
  for (let combination of computerWinCombinations) {
    if (
      fields[combination[0]].content ===
        fields[combination[1]].content &&
      fields[combination[1]].content ===
        fields[combination[2]].content &&
      fields[combination[0]].content === "cross"
    ) {
      for (let adress of combination) {
        fieldElements[adress].classList.add("win");
      }
      for (let fieldElement of fieldElements) {
        fieldElement.removeEventListener("click", playerMakeMove);
      }
      crossesScore++;
      showScore();
      return;
    }
  }
}
function checkForTie() {
  if (numberOfMoves === 9) {
    for (let fieldElement of fieldElements) {
      fieldElement.removeEventListener("click", playerMakeMove);
    }
  }
}

function gameController() {
  if (numberOfMoves === 0) {
    computerMakeMove(chooseFirstMove());
    numberOfMoves++;
  } else if (numberOfMoves % 2 === 0) {
    numberOfMoves++;
    computerMakeMove(chooseField());
    checkForWin();
    checkForTie();
  }
}
gameController();
function callback() {
  gameController();
}
const observer = new MutationObserver(callback);
const observerOptions = {
  childList: true,
  subtree: true,
};
observer.observe(document.querySelector(".gameboard"), observerOptions);
