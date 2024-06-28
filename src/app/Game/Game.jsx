import { useEffect, useReducer, useState } from 'react';
import Piece from '../../components/Puzzle/Piece/Piece';
import styles from './Game.module.scss';

function piecesReducer(state, action){
  switch(action.type){
    case 'set-piece':
      return state.map(piece => (
        {
          ...piece, 
          x: piece.i === action.i && piece.j === action.j ? action.x : piece.x,
          y: piece.i === action.i && piece.j === action.j ? action.y : piece.y
        }
      ));
      break;
    case 'grabbed':
      return state.map(piece => (
        {
          ...piece, 
          dragging: piece.i === action.i && piece.j === action.j,
          size: piece.i === action.i && piece.j === action.j ? 1000 : piece.size
        }
      ));
    case 'dragging':
      return state.map(piece => (
        {
          ...piece, 
          x: piece.dragging ? action.x : piece.x,
          y: piece.dragging ? action.y : piece.y
        }
      ));
    case 'dropped':
      const isOnTarget = (piece) => piece.x === piece.tX && piece.y === piece.tY;
      return state.map(piece => (
        {
          ...piece, 
          dragging: false,
          x: isOnTarget(piece) ? piece.tX : piece.oX,
          y: isOnTarget(piece) ? piece.tY : piece.oY 
        }
      ));
  }
}

function Game() {
  
  const puzzleSize = [3, 3];
  const length = puzzleSize[0]*puzzleSize[1];
  const [screen, setScreen] = useState([window.innerWidth, window.innerHeight]);

  const [pieces, dispatch] = useReducer(piecesReducer, Array.from({ length }, (v, n) => {
    const i = Math.floor(n/puzzleSize[1]);
    const j = n - i*puzzleSize[1];
    const oSize = (window.innerWidth*1)/puzzleSize[1];
    return {
      i, j,
      dragging: false,
      oSize,
      size: (window.innerWidth*0.9)/puzzleSize[1],
      x: (oSize-50)*j, y: (oSize-50)*i,
      oX: oSize*j, oY: oSize*i,
      tX: 0, tY: 0
    }
  }));

  const onGrab = (e, i, j) => {
    if(e.type !== 'touchstart') e.preventDefault();
    dispatch({type: 'grabbed', i, j});
  }
  const onDrag = (e) => {
    if(e.type !== 'touchmove') e.preventDefault();
    if(pieces.some(piece => piece.dragging)) dispatch({type: 'dragging', x: (e.clientX || e.touches[0].clientX || 1) - (pieces[0]?.oSize/2), y: (e.clientY || e?.touches[0]?.clientY || 1) - (pieces[0]?.oSize/2)});
  }

  const onDrop = (e, i, j) => {
    e.preventDefault();
    dispatch({type: 'dropped', i, j});
  }

  useEffect(()=>{
    
    const handleResize = () => setScreen([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <div className={styles.Page} onMouseMove={onDrag}>
      <h1>Game</h1>
      {
        pieces.map(piece => (
          <Piece 
            key={`${piece.j}${piece.i}`} i={piece.i} j={piece.j} 
            onGrab={(e)=>onGrab(e, piece.i, piece.j)} 
            onDrop={(e)=>onDrop(e, piece.i, piece.j)}
            onDrag={onDrag}
            style={{
              position: 'absolute', 
              left: piece?.x, 
              top: piece?.y,
              width: piece?.oSize,
              height: piece?.oSize,
              cursor: piece.dragging ? 'grabbing' : 'grab',
              zIndex: piece.dragging ? 10 : 1
            }}
          />
        ))
      }
    </div>
  )
}

export default Game;