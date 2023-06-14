import styles from "./Board.module.css";
import Square from "../Square/Square";
import { useGame } from "../../context/GameContext";
import { ReactElement } from "react";

export default function Board(): ReactElement {
  const { board } = useGame();

  return (
    <div className={styles.board}>
      {board.map((x, i) => (
        // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Square key={i} value={x} position={i} />
      ))}
    </div>
  );
}
