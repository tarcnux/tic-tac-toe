const cells = document.querySelectorAll(".cell");
const statusDiv = document.getElementById("status");
const restartButton = document.getElementById("restart");
const modeSelectionDiv = document.getElementById("modeSelection");
const gameDiv = document.getElementById("game");
const gameModeDiv = document.getElementById("gameMode");
const twoPlayersBtn = document.getElementById("twoPlayersBtn");
const vsComputerBtn = document.getElementById("vsComputerBtn");

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

let currentPlayer = "X";
let gameActive = true;
let gameMode = null; // "twoPlayers" ou "vsComputer"
let playerSymbol = "X"; // X para humano, O para IA
let computerSymbol = "O";

// ===== MINIMAX ALGORITHM =====
function evaluateBoard(board) {
  // Verifica se O (IA) ganhou
  if (checkWinner(board, "O")) return 10;
  // Verifica se X (jogador) ganhou
  if (checkWinner(board, "X")) return -10;
  // Empate
  return 0;
}

function checkWinner(boardState, player) {
  for (let i = 0; i < 3; i++) {
    if (boardState[i].every(cell => cell === player)) return true;
    if (boardState.every(row => row[i] === player)) return true;
  }
  if (boardState[0][0] === player && boardState[1][1] === player && boardState[2][2] === player) return true;
  if (boardState[0][2] === player && boardState[1][1] === player && boardState[2][0] === player) return true;
  return false;
}

function isBoardFull(boardState) {
  return boardState.flat().every(cell => cell !== "");
}

function getAvailableMoves(boardState) {
  const moves = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (boardState[row][col] === "") {
        moves.push([row, col]);
      }
    }
  }
  return moves;
}

function minimax(boardState, depth, isMaximizing) {
  const score = evaluateBoard(boardState);

  if (score === 10) return score - depth; // IA venceu
  if (score === -10) return score + depth; // Jogador venceu
  if (isBoardFull(boardState)) return 0; // Empate

  if (isMaximizing) {
    // IA tenta maximizar o score
    let maxScore = -Infinity;
    const moves = getAvailableMoves(boardState);
    for (let [row, col] of moves) {
      boardState[row][col] = "O";
      const score = minimax(boardState, depth + 1, false);
      maxScore = Math.max(score, maxScore);
      boardState[row][col] = "";
    }
    return maxScore;
  } else {
    // Jogador tenta minimizar o score
    let minScore = Infinity;
    const moves = getAvailableMoves(boardState);
    for (let [row, col] of moves) {
      boardState[row][col] = "X";
      const score = minimax(boardState, depth + 1, true);
      minScore = Math.min(score, minScore);
      boardState[row][col] = "";
    }
    return minScore;
  }
}

function getComputerMove(boardState) {
  let bestScore = -Infinity;
  let bestMove = null;
  const moves = getAvailableMoves(boardState);

  for (let [row, col] of moves) {
    boardState[row][col] = "O";
    const score = minimax(boardState, 0, false);
    boardState[row][col] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
  }

  return bestMove;
}

// ===== MODE SELECTION =====
function startGameMode(mode) {
  gameMode = mode;
  modeSelectionDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");

  if (mode === "twoPlayers") {
    gameModeDiv.textContent = "Modo: Dois Jogadores";
  } else {
    gameModeDiv.textContent = "Modo: Jogando contra IA";
  }

  restartGame();
}

// ===== GAME LOGIC =====
function printStatus(message) {
  statusDiv.textContent = message;
}

function handleCellClick(event) {
  if (!gameActive) return;
  if (gameMode === "vsComputer" && currentPlayer !== playerSymbol) return;

  const row = parseInt(event.target.getAttribute("data-row"));
  const col = parseInt(event.target.getAttribute("data-col"));

  if (board[row][col] !== "") return;

  makeMove(row, col, currentPlayer);

  if (!gameActive) return;

  // Se jogando contra IA e é a vez da IA
  if (gameMode === "vsComputer" && currentPlayer === computerSymbol) {
    printStatus("IA pensando...");
    setTimeout(() => {
      const [aiRow, aiCol] = getComputerMove(board);
      makeMove(aiRow, aiCol, computerSymbol);
    }, 500);
  }
}

function makeMove(row, col, player) {
  board[row][col] = player;
  const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cellElement.textContent = player;

  if (checkWinner(board, player)) {
    if (gameMode === "vsComputer" && player === computerSymbol) {
      printStatus("IA venceu! 🤖");
    } else if (gameMode === "vsComputer" && player === playerSymbol) {
      printStatus("Você venceu! 🎉");
    } else {
      printStatus(`Jogador ${player} venceu!`);
    }
    gameActive = false;
    return;
  }

  if (isBoardFull(board)) {
    printStatus("Empate! 🤝");
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "twoPlayers") {
    printStatus(`Vez do jogador ${currentPlayer}`);
  } else if (currentPlayer === playerSymbol) {
    printStatus("Sua vez");
  } else {
    printStatus("IA está pensando...");
  }
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

  if (gameMode === "twoPlayers") {
    printStatus(`Vez do jogador ${currentPlayer}`);
  } else {
    printStatus("Sua vez");
  }
}

function backToModeSelection() {
  gameDiv.classList.add("hidden");
  modeSelectionDiv.classList.remove("hidden");
  gameMode = null;
  restartGame();
}

// ===== EVENT LISTENERS =====
twoPlayersBtn.addEventListener("click", () => startGameMode("twoPlayers"));
vsComputerBtn.addEventListener("click", () => startGameMode("vsComputer"));
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);
