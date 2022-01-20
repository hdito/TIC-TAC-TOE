const gameboard = (() => {
  let mark = "✕";
  let ableToPlay = true;
  let numberOfMoves = 0;

  const fields = [];
  const fieldElements = document.querySelectorAll(".field");
  const resultElement = document.querySelector(".result");
  const restartButton = document.querySelector("button");

  let previousPlayerMove = null;

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

  const computerMove = () => {
    let canMove = true;
    loop1: for (combination of computerWinCombinations) {
      let completeness = 0;
      for (adress of combination) {
        if (fields[adress].content === "✕") {
          completeness++;
        }
      }
      if (completeness === 2) {
        console.log(combination);
        console.log("first");
        for (adress of combination) {
          if (fields[adress].content === "empty") {
            fields[adress].content = "✕";
            fieldElements[adress].textContent = "✕";
            console.log(fieldElements[adress]);
            for (winField of combination) {
              fieldElements[winField].classList.add("win");
            }
            resultElement.textContent = "✕ WINS";
            canMove = false;
            ableToPlay = false;
            break loop1;
          }
        }
      }
    }
    if (canMove) {
      loop2: for (combination of playerWinCombinations) {
        let completeness = 0;
        for (adress of combination) {
          if (fields[adress].content === "⭕") {
            completeness++;
          }
        }
        if (completeness === 2) {
          console.log("second");
          for (adress of combination) {
            if (fields[adress].content === "empty") {
              fields[adress].content = "✕";
              fieldElements[adress].textContent = "✕";
              numberOfMoves++;
              canMove = false;
              playerWinCombinations = playerWinCombinations.filter(
                (c) => !c.includes(adress)
              );
              break loop2;
            }
          }
        }
      }
    }
    if (canMove && computerWinCombinations.length) {
      console.log("third");
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
      console.log(attractiveness);
      for (let i = 0; i < attractiveness.length; i++) {
        if (maxValue < attractiveness[i]) {
          maxValue = attractiveness[i];
          index = i;
        }
      }
      fields[index].content = "✕";
      fieldElements[index].textContent = "✕";
      numberOfMoves++;
      canMove = false;
      playerWinCombinations = playerWinCombinations.filter(
        (c) => !c.includes(index)
      );
    }
    if (canMove) {
      loop3: for (let i = 0; i < fields.length; i++) {
        if (fields[i].content === "empty") {
          fields[i].content = "✕";
          fieldElements[adress].textContent = "✕";
          numberOfMoves++;
          playerWinCombinations = playerWinCombinations.filter(
            (c) => !c.includes(i)
          );
          break loop3;
        }
      }
    }
    if (numberOfMoves === 9) {
      resultElement.textContent = "TIE";
    }
  };

  const makeMove = (event) => {
    mark = "⭕";
    pressedField = event.target.getAttribute("id");
    if (fields[pressedField].content === "empty" && ableToPlay) {
      fields[pressedField].content = mark;
      event.target.textContent = mark;
      previousPlayerMove = +pressedField;
      mark = "✕";
      console.log(pressedField);
      computerWinCombinations = computerWinCombinations.filter(
        (c) => !c.includes(+pressedField)
      );
      console.log(computerWinCombinations);
      computerMove();
    }
  };
  for (fieldElement of fieldElements) {
    fieldElement.addEventListener("click", makeMove);
  }
  const reset = () => {
    ableToPlay = true;
    numberOfMoves = 0;

    for (let i = 0; i < 9; i++) {
      fields[i].content = "empty";
      fieldElements[i].textContent = null;
      fieldElements[i].classList = "field";
      resultElement.textContent = null;
    }
    for (let i = 0; i < allWinCombinations.length; i++) {
      computerWinCombinations[i] = [...allWinCombinations[i]];
      playerWinCombinations[i] = [...allWinCombinations[i]];
    }
    computerMove();
  };

  restartButton.addEventListener("click", reset);

  for (let i = 0; i < 9; i++) {
    fields[i] = { winCombinations: [] };
    fields[i].content = "empty";
    for (combination of allWinCombinations) {
      fields[i].winCombinations.push([...combination]);
    }
  }
  computerMove();

  return {};
})();
