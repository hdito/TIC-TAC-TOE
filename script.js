const gameboard = (() => {
  let mark = "✕";
  let ableToPlay = true;
  let numberOfMoves = 0;

  const fields = [];
  const fieldElements = document.querySelectorAll(".field");
  const resultElement = document.querySelector(".result");
  const restartButton = document.querySelector("button");

  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const makeMove = (event) => {
    pressedField = event.target.getAttribute("id");
    if (
      fields[pressedField].content === "empty" &&
      ableToPlay === true
    ) {
      fields[pressedField].content = mark;
      event.target.textContent = mark;
      for (combination of fields[pressedField].winCombinations) {
        if (
          fields[combination[0]].content ===
            fields[combination[1]].content &&
          fields[combination[1]].content ===
            fields[combination[2]].content
        ) {
          for (let i = 0; i < 3; i++) {
            const winField = fieldElements[combination[i]];
            winField.classList.add("win");
            resultElement.textContent = `${mark} WINS!`;
            ableToPlay = false;
          }
        }
      }
      if (mark === "✕") {
        mark = "⭕";
      } else {
        mark = "✕";
      }
      numberOfMoves++;
      if (numberOfMoves === 9) {
        resultElement.textContent = "Tie!";
        ableToPlay = false;
      }
    }
  };

  const reset = () => {
    ableToPlay = true;
    for (let i = 0; i < 9; i++) {
      fields[i].content = "empty";
      fieldElements[i].textContent = null;
      fieldElements[i].classList = "field";
      resultElement.textContent = null;
      numberOfMoves = 0;
    }
  };

  for (fieldElement of fieldElements) {
    fieldElement.addEventListener("click", makeMove);
  }
  restartButton.addEventListener("click", reset);

  for (let i = 0; i < 9; i++) {
    fields[i] = { winCombinations: [] };
    fields[i].content = "empty";
    for (combination of winCombinations) {
      if (combination.includes(i)) {
        fields[i].winCombinations.push(combination);
      }
    }
  }
})();
