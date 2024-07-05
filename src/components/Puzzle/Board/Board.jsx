import { useEffect, useRef, useState } from 'react';
import styles from './Board.module.scss';

function Board({ size=[3,3], scrsize={}, setBoardStyle, boardStyle}) {
  const length = size[0]*size[1];

  const boardRef = useRef(null);

  useEffect(()=>{
    const boardWidth = boardRef.current.offsetWidth;
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
          {
              Array.from({ length }, (v, n) => (
                  <div key={n} className={styles.box}></div>
              ))
          }
      </div>
    </div>
  )
}

export default Board