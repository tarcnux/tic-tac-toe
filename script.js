const cells = document.querySelectorAll(".cell");
const statusDiv = document.getElementById("status");
const restartButton = document.getElementById("restart");

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

let currentPlayer = "X";
let gameActive = true;

function printStatus(message) {
  statusDiv.textContent = message;
}

function checkWinner(player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}

function isBoardFull() {
  return board.flat().every(cell => cell !== "");
}

function handleCellClick(event) {
  if (!gameActive) return;

  const row = parseInt(event.target.getAttribute("data-row"));
  const col = parseInt(event.target.getAttribute("data-col"));

  if (board[row][col] !== "") return;

  board[row][col] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner(currentPlayer)) {
    printStatus(`Jogador ${currentPlayer} venceu!`);
    gameActive = false;
    return;
  }

  if (isBoardFull()) {
    printStatus("Empate!");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  printStatus(`Vez do jogador ${currentPlayer}`);
}

function restartGame() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach(cell => (cell.textContent = ""));
  printStatus(`Vez do jogador ${currentPlayer}`);
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);

printStatus(`Vez do jogador ${currentPlayer}`);
