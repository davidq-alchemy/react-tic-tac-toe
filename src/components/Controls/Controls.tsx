import styles from "./Controls.module.css";
import { useGame } from "../../context/GameContext";
import { ReactElement } from "react";

export default function Controls(): ReactElement {
  const { gameMessage, newGame, computer, setComputer } = useGame();

  return (
    <div className={styles.container}>
      <select className={styles.aiSelect} value={computer} onChange={(e) => setComputer(e.target.value)}>
        <option value="">No Computer</option>
        <option value="O">Computer O</option>
        <option value="X">Computer X</option>
        <option value="both">Two Computers</option>
      </select>
      <p className={styles.message}>{gameMessage}</p>
      <button type="button" className={styles.button} onClick={newGame}>
        New Game
      </button>
    </div>
  );
}
