const { createContext, useContext, useState } = require('react');

const GameContext = createContext();

export function GameContextProvider({ children }) {
  const [board, setBoard] = useState(new Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('Your turn X');
  const [computer, setComputer] = useState('');

  function newGame() {
    setBoard(new Array(9).fill(''));
    setCurrentPlayer('X');
    setGameOver(false);
    setGameMessage('Your turn X');
  }

  function setStateFromMove(position) {
    if (board[position] !== '' || gameOver) return;

    const nextBoard = makeMove(board, currentPlayer, position);
    setBoard(nextBoard);

    const winner = getWinner(nextBoard);
    if (winner) {
      setGameOver(true);
      setGameMessage(`${winner} won`);
    } else if (isBoardFull(nextBoard)) {
      setGameOver(true);
      setGameMessage("It's a cat's game");
    }
    else {
      const nextPlayer = togglePlayer(currentPlayer);
      setCurrentPlayer(nextPlayer);
      setGameMessage(`Your turn ${nextPlayer}`);
    }
  }

  // If we're rendering and it's the computer's turn,
  // let the computer play their turn and immediately re-render.
  if (currentPlayer === computer && !gameOver) {
    const move = pickMove(board, currentPlayer);
    setStateFromMove(move);
  }

  // Handler for human player interaction.
  function playerChoseSquare(position) {
    setStateFromMove(position);
  }

  return <GameContext.Provider
    value={{
      board,
      currentPlayer,
      gameOver,
      gameMessage,
      computer,
      setComputer,
      playerChoseSquare,
      newGame
    }}
  >
    {children}
  </GameContext.Provider>;
}

export function useGame() {
  const gameContextValue = useContext(GameContext);
  if (!gameContextValue) {
    throw new Error('useGame() called outside of a GameContextProvider');
  }
  return gameContextValue;
}

/*
 * Utility functions.
 */

function makeMove(board, player, position) {
  if (board[position] !== '') return;

  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

function togglePlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

const winningSequences = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
export function getWinner(board) {
  for (const sequence of winningSequences) {
    const [i, j, k] = sequence;
    if (board[i] !== '' && board[i] === board[j] && board[j] === board[k])
      return board[i];
  }
  return undefined;
}

function isBoardFull(board) {
  return !board.includes('');
}

function pickMove(board, player) {
  let optimalMoves = { moves: undefined, value: Number.NEGATIVE_INFINITY };

  for (let i = 0; i < board.length; i++) {
    const nextBoard = makeMove(board, player, i);
    if (!nextBoard) continue;

    const moveValue = minimax(nextBoard, togglePlayer(player), player);

    if (moveValue > optimalMoves.value) {
      optimalMoves = { moves: [i], value: moveValue };
    } else if (moveValue === optimalMoves.value) {
      optimalMoves.moves.push(i);
    }
  }

  const moves = optimalMoves.moves;
  return moves[Math.floor(Math.random() * moves.length)];
}

function minimax(board, currentPlayer, maximizingPlayer, alpha = Number.NEGATIVE_INFINITY, beta = Number.POSITIVE_INFINITY) {
  const winner = getWinner(board);
  if (winner) {
    return winner === maximizingPlayer ? 1 : -1;
  } else if (isBoardFull(board)) {
    return 0;
  }

  let value;
  if (maximizingPlayer === currentPlayer) {
    value = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < board.length; i++) {
      const nextBoard = makeMove(board, currentPlayer, i);
      if (!nextBoard) continue;

      value = Math.max(value, minimax(nextBoard, togglePlayer(currentPlayer), maximizingPlayer, alpha, beta));
      if (value >= beta) break;
      alpha = Math.max(alpha, value);
    }
  } else {
    value = Number.POSITIVE_INFINITY;
    for (let i = 0; i < board.length; i++) {
      const nextBoard = makeMove(board, currentPlayer, i);
      if (!nextBoard) continue;

      value = Math.min(value, minimax(nextBoard, togglePlayer(currentPlayer), maximizingPlayer, alpha, beta));
      if (value <= alpha) break;
      beta = Math.min(beta, value);
    }
  }

  return value;
}
