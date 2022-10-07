import styles from './Board.module.css';
import Square from '../Square/Square';
import { useGame } from '../../context/GameContext';

export default function Board() {
  const { board } = useGame();

  return <div className={styles.board}>
    {board.map((x, i) => <Square key={i} value={x} position={i} />)}
  </div>;
}
