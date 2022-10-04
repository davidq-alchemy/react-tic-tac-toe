import styles from './Square.module.css';
import { useGame } from '../../context/GameContext';

export default function Square({ value, position }) {
  const { chooseSquare } = useGame();

  return <div
    className={styles.square}
    onClick={() => chooseSquare(position)}
  >
    {value}
  </div>;
}
