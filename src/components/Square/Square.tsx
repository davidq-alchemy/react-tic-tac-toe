import styles from "./Square.module.css";
import { useGame } from "../../context/GameContext";

type Props = {
  value: string;
  position: number;
};

export default function Square({ value, position }: Props) {
  const { playerChoseSquare } = useGame();

  return (
    <div className={styles.square} onClick={() => playerChoseSquare(position)}>
      {value}
    </div>
  );
}
