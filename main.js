const container = document.getElementById("container");
const statusText = document.getElementById("status");
let currentFullBoard = [];
let currentLevel = "easy";

function generateFullBoard() {
  let board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveHelper(board);
  return board;
}

function preparePuzzle(fullBoard, level) {
  let puzzle = JSON.parse(JSON.stringify(fullBoard));
  let attempts = level === "easy" ? 30 : level === "medium" ? 45 : 60;

  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }
  return puzzle;
}

function createSudokuGrid(puzzle) {
  container.innerHTML = "";
  puzzle.forEach((row, rIdx) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    row.forEach((cell, cIdx) => {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add("cell");

      if (cell !== 0) {
        input.value = cell;
        input.readOnly = true;
        input.classList.add("fixed-cell");
      } else {
        input.classList.add("user-cell");
        input.oninput = (e) => validateInput(e.target, rIdx, cIdx);
      }
      rowDiv.appendChild(input);
    });
    container.appendChild(rowDiv);
  });
}

function validateInput(input, row, col) {
  const val = parseInt(input.value);
  if (isNaN(val) || val === 0) {
    input.value = "";
    input.classList.remove("invalid");
    return;
  }

  if (val === currentFullBoard[row][col]) {
    input.classList.remove("invalid");
    checkWin();
  } else {
    input.classList.add("invalid");
  }
}

function checkWin() {
  const inputs = document.querySelectorAll(".user-cell");
  const allCorrect = Array.from(inputs).every((input) => {
    return !input.classList.contains("invalid") && input.value !== "";
  });

  if (allCorrect) {
    statusText.innerText = "🎉 Excellent! Starting new game...";
    statusText.style.color = "green";
    setTimeout(() => startGame(currentLevel), 2000);
  }
}

function startGame(level) {
  currentLevel = level;
  statusText.innerText = "";
  currentFullBoard = generateFullBoard();
  const puzzle = preparePuzzle(currentFullBoard, level);
  createSudokuGrid(puzzle);
}

function solveHelper(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (let num of nums) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveHelper(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValidMove(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  let startR = Math.floor(row / 3) * 3,
    startC = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startR + i][startC + j] === num) return false;
    }
  }
  return true;
}

document.getElementById("solveButton").onclick = () =>
  createSudokuGrid(currentFullBoard);
document.getElementById("newGameButton").onclick = () =>
  startGame(currentLevel);


window.onload = () => startGame("easy");
