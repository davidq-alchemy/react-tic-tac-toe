import styles from './Controls.module.css';
import { useGame } from '../../context/GameContext';

export default function Controls() {
  const { gameMessage, newGame } = useGame();
  return <div className={styles.container}>
    <p className={styles.message}>{gameMessage}</p>
    <button
      className={styles.button}
      onClick={newGame}
    >
      New Game
    </button>
  </div>;
}
