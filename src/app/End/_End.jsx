import { useNavigate, useParams } from "react-router-dom";
import styles from './End.module.scss';
import { useRef, useState } from "react";

function End() {
  const puzzleSize = [3, 3];
  const puzzleRatio = puzzleSize[1]/puzzleSize[0];

  const { img, points } = useParams();
  const [imgStyles, setImgStyles] = useState({});

  const handleLoad = e => {
    const { width, height } = e.target;
    const imgRatio = width/height;
    if(imgRatio < puzzleRatio) setImgStyles({width: '100%', height: 'auto'});
    else setImgStyles({width: 'auto', height: '100%'});

    setTimeout(() => window.location.href = '/', 7000);
  }

  return (
    <div className={styles.end}>
      <header>
        <div className={styles.logo}>
          <img src='/assets/img/logo/logo.png' alt='BNA logo' />
        </div>
      </header>
      <div className={styles.board} style={{aspectRatio: puzzleRatio}}>
        <img
          onLoad={handleLoad}
          src={`/assets/img/puzzle/${img.replace('+', '.')}`} alt='puzzle' 
          style={imgStyles}
        />
      </div>
      <div className={styles.points}>
        <h1>¡Excelente!</h1>
        <span>Armaste el rompecabezas en {points} segundos</span>
      </div>
    </div>
  )
}

export default End;