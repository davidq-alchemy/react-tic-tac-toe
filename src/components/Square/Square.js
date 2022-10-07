import styles from './Square.module.css';
import { useGame } from '../../context/GameContext';

export default function Square({ value, position }) {
  const { playerChoseSquare } = useGame();

  return <div
    className={styles.square}
    onClick={() => playerChoseSquare(position)}
  >
    {value}
  </div>;
}
