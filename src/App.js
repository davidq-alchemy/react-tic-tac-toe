import styles from './App.module.css';
import Board from './components/Board/Board';
import { useGame } from './context/GameContext';

function App() {
  const { board } = useGame();

  return <div className={styles.app}>
    <Board board={board} />
  </div>;
}

export default App;
