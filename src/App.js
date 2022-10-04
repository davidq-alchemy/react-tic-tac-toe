import './App.css';
import Board from './components/Board/Board';
import { useGame } from './context/GameContext';

function App() {
  const { board } = useGame();

  return <Board board={board} />;
}

export default App;
