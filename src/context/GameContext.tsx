import { ReactNode, createContext, useContext, useState } from "react";

type Game = {
  board: string[];
  currentPlayer: string;
  gameOver: boolean;
  gameMessage: string;
  computer: string;
  setComputer: (player: string) => void;
  playerChoseSquare: (position: number) => void;
  newGame: () => void;
};

const GameContext = createContext<Game | null>(null);

export function GameContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [board, setBoard] = useState<string[]>(new Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>("Your turn X");
  const [computer, setComputer] = useState<string>("");

  function newGame() {
    setBoard(new Array(9).fill(""));
    setCurrentPlayer("X");
    setGameOver(false);
    setGameMessage("Your turn X");
  }

  function setStateFromMove(position: number): void {
    if (board[position] !== "" || gameOver) return;

    const nextBoard = makeMove(board, currentPlayer, position);
    if (!nextBoard) return;
    setBoard(nextBoard);

    const winner = getWinner(nextBoard);
    if (winner) {
      setGameOver(true);
      setGameMessage(`${winner} won`);
    } else if (isBoardFull(nextBoard)) {
      setGameOver(true);
      setGameMessage("It's a cat's game");
    } else {
      const nextPlayer = togglePlayer(currentPlayer);
      setCurrentPlayer(nextPlayer);
      setGameMessage(`Your turn ${nextPlayer}`);
    }
  }

  // If we're rendering and it's the computer's turn,
  // let the computer play their turn and immediately re-render.
  if (!gameOver && (computer === currentPlayer || computer === "both")) {
    const move = pickMove(board, currentPlayer);
    setStateFromMove(move);
  }

  // Handler for human player interaction.
  function playerChoseSquare(position: number): void {
    setStateFromMove(position);
  }

  return (
    <GameContext.Provider
      value={{
        board,
        currentPlayer,
        gameOver,
        gameMessage,
        computer,
        setComputer,
        playerChoseSquare,
        newGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const gameContextValue = useContext(GameContext);
  if (!gameContextValue) {
    throw new Error("useGame() called outside of a GameContextProvider");
  }
  return gameContextValue;
}

/*
 * Utility functions.
 */

function makeMove(board: string[], player: string, position: number): string[] | undefined {
  if (board[position] !== "") return;

  const newBoard = [...board];
  newBoard[position] = player;
  return newBoard;
}

function togglePlayer(player: string): string {
  return player === "X" ? "O" : "X";
}

const winningSequences = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export function getWinner(board: string[]): string | undefined {
  for (const sequence of winningSequences) {
    const [i, j, k] = sequence;
    if (board[i] !== "" && board[i] === board[j] && board[j] === board[k]) return board[i];
  }
  return undefined;
}

function isBoardFull(board: string[]): boolean {
  return !board.includes("");
}

function pickMove(board: string[], player: string) {
  let optimalMoves: { moves: number[]; value: number } = { moves: [], value: Number.NEGATIVE_INFINITY };

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

function minimax(
  board: string[],
  currentPlayer: string,
  maximizingPlayer: string,
  alpha = Number.NEGATIVE_INFINITY,
  beta = Number.POSITIVE_INFINITY,
): number {
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
