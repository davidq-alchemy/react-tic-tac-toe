import styles from './App.module.css';
import Board from './components/Board/Board';
import Controls from './components/Controls/Controls';
import { useGame } from './context/GameContext';

function App() {
  const { board } = useGame();

  return <div className={styles.app}>
    <h1 className={styles.centeredText}>Tic-tac-toe</h1>
    <Controls />
    <Board board={board} />
  </div>;
}

export default App;
