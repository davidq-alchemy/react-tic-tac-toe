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

  if (currentPlayer === computer && !gameOver) {
    const move = pickMove(board, currentPlayer);
    setStateFromMove(move);
  }

  function chooseSquare(position) {
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
      chooseSquare,
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

function makeMove(board, player, position) {
  if (board[position] !== '') return;

  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

function togglePlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

export function getWinner(board) {
  function isWinningSequence(t1, t2, t3) {
    return t1 !== '' && t1 === t2 && t2 === t3;
  }

  for (let i = 0; i < 3; i++) {
    const rowStart = i * 3;
    if (isWinningSequence(board[rowStart], board[rowStart + 1], board[rowStart + 2])) {
      return board[rowStart];
    }
  }

  for (let i = 0; i < 3; i++) {
    const columnStart = i;
    if (isWinningSequence(board[columnStart], board[columnStart + 3], board[columnStart + 6])) {
      return board[columnStart];
    }
  }

  if (isWinningSequence(board[0], board[4], board[8])) {
    return board[0];
  }

  if (isWinningSequence(board[6], board[4], board[2])) {
    return board[6];
  }

  return undefined;
}

function isBoardFull(board) {
  return !board.includes('');
}

function pickMove(board, player) {
  let bestMove = { value: Number.NEGATIVE_INFINITY, position: undefined };

  for (let i = 0; i < board.length; i++) {
    const nextBoard = makeMove(board, player, i);
    if (!nextBoard) continue;

    const moveValue = minimax(nextBoard, togglePlayer(player), player);

    if (moveValue > bestMove.value) {
      bestMove = { value: moveValue, position: i };
    }
  }

  return bestMove.position;
}

function minimax(board, currentPlayer, maximizingPlayer) {
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

      value = Math.max(value, minimax(nextBoard, togglePlayer(currentPlayer), maximizingPlayer));
    }
  } else {
    value = Number.POSITIVE_INFINITY;
    for (let i = 0; i < board.length; i++) {
      const nextBoard = makeMove(board, currentPlayer, i);
      if (!nextBoard) continue;

      value = Math.min(value, minimax(nextBoard, togglePlayer(currentPlayer), maximizingPlayer));
    }
  }

  return value;
}
