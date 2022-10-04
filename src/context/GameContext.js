const { createContext, useContext, useState } = require('react');

const GameContext = createContext();

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
  for (const content of board) {
    if (content === '') return false;
  }
  return true;
}

export function GameContextProvider({ children }) {
  const [board, setBoard] = useState(new Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameInProgress, setGameInProgress] = useState(true);
  const [gameMessage, setGameMessage] = useState('Your turn X');

  function newGame() {
    setBoard(new Array(9).fill(''));
    setCurrentPlayer('X');
    setGameInProgress(true);
    setGameMessage('Your turn X');
  }

  function chooseSquare(n) {
    if (board[n] !== '' || !gameInProgress) return;

    const newBoard = [...board];
    newBoard[n] = currentPlayer;
    setBoard(newBoard);


    const winner = getWinner(newBoard);
    if (winner) {
      setGameInProgress(false);
      setGameMessage(`${winner} won`);
    } else if (isBoardFull(newBoard)) {
      setGameInProgress(false);
      setGameMessage("It's a cat's game");
    }
    else {
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setGameMessage(`Your turn ${nextPlayer}`);
    }
  }

  console.log('best move is ' + pickMove(board, currentPlayer));

  return <GameContext.Provider
    value={{
      board,
      currentPlayer,
      gameInProgress,
      gameMessage,
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

function pickMove(board, player) {
  let bestMove = { value: Number.NEGATIVE_INFINITY, position: -1 };
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      const newBoard = [...board];
      newBoard[i] = player;
      const nextPlayer = player === 'X' ? 'O' : 'X';
      const moveValue = minimax({ board: newBoard, player: nextPlayer }, player);
      if (moveValue > bestMove.value) {
        bestMove = { value: moveValue, position: i };
      }
    }
  }

  return bestMove.position;
}

function minimax(node, maximizingPlayer) {
  const { board, player } = node;

  const winner = getWinner(board);
  if (winner) {
    return winner === maximizingPlayer ? 1 : -1;
  } else if (isBoardFull(board)) {
    return 0;
  }

  function makeMove(index) {
    if (board[index] !== '') return null;

    const nextBoard = [...board];
    nextBoard[index] = player;
    const nextPlayer = player === 'X' ? 'O' : 'X';

    return { board: nextBoard, player: nextPlayer };
  }

  let value;
  if (maximizingPlayer === player) {
    value = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < board.length; i++) {
      const node = makeMove(i);
      if (!node) continue;

      value = Math.max(value, minimax(node, maximizingPlayer));
    }
  } else {
    value = Number.POSITIVE_INFINITY;
    for (let i = 0; i < board.length; i++) {
      const node = makeMove(i);
      if (!node) continue;

      value = Math.min(value, minimax(node, maximizingPlayer));
    }
  }

  return value;
}
