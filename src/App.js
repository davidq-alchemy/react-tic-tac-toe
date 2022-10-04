import styles from './App.module.css';
import Board from './components/Board/Board';
import Controls from './components/Controls/Controls';

function App() {
  return <div className={styles.app}>
    <h1 className={styles.centeredText}>Tic-tac-toe</h1>
    <Controls />
    <Board />
  </div>;
}

export default App;
