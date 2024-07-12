import { randomize } from '../../utils/randomize';
import { Link } from 'react-router-dom';
import styles from './Home.module.scss';

function Home() {
  const imgs = ['cultivo+png', 'granja+png', 'tractor+png'];


  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <img src='/assets/img/logo/logo.png' alt='BNA logo' />
      </div>
      <div className={styles.text}>
        <h1>¡Vamos a jugar!</h1>
        <h2>Completa el rompecabezas y gana :D</h2>
      </div>
      <div className={styles.bottom}>
        <Link to={`/game/${imgs[randomize(imgs.length)[0]]}`}>Jugar</Link>
      </div>
    </div>
  )
}

export default Home;