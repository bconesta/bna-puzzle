import { useEffect, useRef, useState } from 'react';
import styles from './Board.module.scss';

function Board({ size=[3,3], scrsize={}, setBoardStyle, boardStyle, img }) {
  const length = size[0]*size[1];
  const puzzleRatio = size[1]/size[0];

  const boardRef = useRef(null);
  const [imgStyles, setImgStyles] = useState({});

  const handleLoad = e => {
    const { width, height } = e.target;
    const imgRatio = width/height;
    if(imgRatio < puzzleRatio) setImgStyles({width: '100%', height: 'auto'});
    else setImgStyles({width: 'auto', height: '100%'});
  }


  useEffect(()=>{
    const boardWidth = boardRef.current.offsetWidth;
    //TO DO: Check update property. For some reason 'y' property starts on bad range
    setBoardStyle({
      style : {
        height: (boardWidth/size[1])*size[0],
        gridTemplateColumns: `repeat(${size[1]}, 1fr)`,
        gridTemplateRows: `repeat(${size[0]}, 1fr)`
      },
      x : boardRef.current.getBoundingClientRect().x,
      y : boardRef.current.getBoundingClientRect().y
    })
  }, [scrsize])

  return (
    <div className={styles.border}>
      <div ref={boardRef} className={styles.board} style={boardStyle.style}>
        <img src={img} alt='background'
          onLoad={handleLoad}
          style={imgStyles}
        />
      </div>
    </div>
  )
}

export default Board