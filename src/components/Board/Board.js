import styles from './Board.module.css';
import Square from '../Square/Square';

export default function Board({ board }) {
  return <div className={styles.board}>
    {board.map((x, i) => <Square key={i} value={x} position={i} />)}
  </div>;
}
