import { useEffect, useReducer, useRef, useState } from 'react';
import Piece from '../../components/Puzzle/Piece/Piece';
import styles from './Game.module.scss';
import Board from '../../components/Puzzle/Board/Board';

function piecesReducer(state, action){
  switch(action.type){
    case 'set-pieces-size':
      return state.map(piece => (
        {
          ...piece, 
          oX: piece.j*action.oSize,
          oY: piece.i*action.oSize,
          x: piece.j*action.size,
          y: piece.i*action.size,
          oSize: action.oSize,
          size: action.size,
          tX: action.bX * piece.j,
          tY: action.bY * piece.i
        }
      ));
    case 'grabbed':
      return state.map(piece => (
        {
          ...piece, 
          dragging: piece.i === action.i && piece.j === action.j
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
      const isOnTarget = (piece) => 
        Math.abs(piece.tX - piece.x - piece.size*0.199) < (piece.size*0.199) && Math.abs(piece.tY - piece.y - piece.size*0.199) < (piece.size*0.199);
      return state.map(piece => (
        {
          ...piece, 
          dragging: false,
          x: isOnTarget(piece) ? piece.tX : piece.oX,
          y: isOnTarget(piece) ? piece.tY : piece.oY,
          onTarget: isOnTarget(piece)
        }
      ));
  }
}

function Game() {
  const puzzleSize = [3, 3];
  const length = puzzleSize[0]*puzzleSize[1];
  //HOOKS
  const pageRef = useRef(null);
  const [screen, setScreen] = useState({width: window.innerWidth, height: window.innerHeight, xOff: 0, yOff: 0});
  const [boardStyle, setBoardStyle] = useState({});
  const [pieces, dispatch] = useReducer(piecesReducer, Array.from({ length }, (v, n) => {
    const i = Math.floor(n/puzzleSize[1]);
    const j = n - i*puzzleSize[1];
    const oSize = (window.innerWidth*1)/puzzleSize[1];
    return {
      i, j,
      onTarget: false,
      dragging: false,
      oSize,
      size: (window.innerWidth*0.9)/puzzleSize[1],
      x: (oSize-50)*j, y: (oSize-50)*i,
      oX: oSize*j, oY: oSize*i,
      tX: 0, tY: 0
    }
  }));
  //END HOOKS
  //FUNCTIONS
  const onGrab = (e, i, j) => {
    if(e.type !== 'touchstart') e.preventDefault();
    dispatch({type: 'grabbed', i, j});
  }
  const onDrag = (e) => {
    const { xOff, yOff } = screen;
    if(e.type !== 'touchmove') 
      e.preventDefault();
    if(pieces.some(piece => piece.dragging)) 
      dispatch({
        type: 'dragging', 
        x: (e.clientX || e.touches?.[0].clientX) - (pieces[0]?.size/2) - xOff, 
        y: (e.clientY || e.touches?.[0].clientY) - (pieces[0]?.size/2) - yOff
      });
  }

  const onDrop = (e, i, j) => {
    e.preventDefault();
    dispatch({type: 'dropped', i, j});
  }
  //END FUNCTIONS

  useEffect(()=>{
    const handleResize = () => {
      const container = pageRef.current.getBoundingClientRect();
      setScreen({width: container.width, height: container.height, xOff: container.x, yOff: container.y});
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  useEffect(()=>{
    const { xOff, yOff } = screen;
    console.log(boardStyle.y)
    dispatch({
      type: 'set-pieces-size', 
      oSize: (screen.width)/puzzleSize[1], 
      size: (boardStyle.style?.height/puzzleSize[0])/0.6025,
      bX: boardStyle.x - xOff,
      bY: boardStyle.y - yOff    
    });
  }, [boardStyle])

  useEffect(()=>{
    const piece = pieces.find(piece => piece.dragging)
    if(piece) console.log(piece.y);
  }, [pieces])

  return (
    <div ref={pageRef} className={styles.Page} onMouseMove={onDrag}>
      <h1>Game</h1>
      {
        pieces.map(piece => (
          <Piece
            puzzleSize={puzzleSize}
            key={`${piece.j}${piece.i}`} i={piece.i} j={piece.j} 
            onGrab={(e)=>onGrab(e, piece.i, piece.j)} 
            onDrop={(e)=>onDrop(e, piece.i, piece.j)}
            onDrag={onDrag}
            style={{
              position: 'absolute', 
              left: piece?.x || 0, 
              top: piece?.y || 0,
              width: piece?.dragging ? piece?.size : piece?.oSize,
              height: piece?.dragging ? piece?.size : piece?.oSize,
              cursor: piece.dragging ? 'grabbing' : 'grab',
              zIndex: piece.dragging ? 10 : 1
            }}
          />
        ))
      }
      <Board size={puzzleSize} scrsize={screen} boardStyle={boardStyle} setBoardStyle={setBoardStyle} />
    </div>
  )
}

export default Game;