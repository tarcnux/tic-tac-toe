/*
Criado pela IA do Coursera, aquela que fica do ladinho tirando dúvidas, hehehe
Código simples em JavaScript para jogar Tic-Tac-Toe no console do navegador. 
Ele permite dois jogadores alternarem jogadas, verifica vitória e empate:
*/
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

let currentPlayer = "X";

function printBoard() {
  console.log(board.map(row => row.map(cell => cell || " ").join(" | ")).join("\n---------\n"));
}

function checkWinner(player) {
  // Linhas e colunas
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  // Diagonais
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}

function isBoardFull() {
  return board.flat().every(cell => cell !== "");
}

function play(row, col) {
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    console.log("Posição inválida. Use valores entre 0 e 2.");
    return;
  }
  if (board[row][col] !== "") {
    console.log("Posição já ocupada. Tente outra.");
    return;
  }
  board[row][col] = currentPlayer;
  printBoard();

  if (checkWinner(currentPlayer)) {
    console.log(`Jogador ${currentPlayer} venceu!`);
    return;
  }
  if (isBoardFull()) {
    console.log("Empate!");
    return;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  console.log(`Vez do jogador ${currentPlayer}`);
}

// Exemplo de uso:
// play(0, 0);
// play(1, 1);
// play(0, 1);
// play(2, 2);
// play(0, 2);
