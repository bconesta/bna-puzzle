import Piece from '../../components/Puzzle/Piece/Piece';
import styles from './Game.module.scss';

function Game() {
  return (
    <div className={styles.Page}>
        <Piece />
    </div>
  )
}

export default Game;