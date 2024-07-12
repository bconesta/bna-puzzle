import { useEffect, useReducer, useRef, useState } from 'react';
import Piece from '../../components/Puzzle/Piece/Piece';
import styles from './Game.module.scss';
import Board from '../../components/Puzzle/Board/Board';
import { randomize } from '../../utils/randomize';
import { useNavigate, useParams } from 'react-router-dom';

function piecesReducer(state, action){
  switch(action.type){
    case 'set-pieces-size':
      return state.map(piece => (
        {
          ...piece,
          x: piece.j*action.size,
          y: piece.i*action.size,
          size: action.size,
          tX: action.size * piece.j * 0.601 + action.bX,
          tY: action.size * piece.i * 0.601 + action.bY
        }
      ));
    case 'grabbed':
      const grabbed = piece => (piece.i === action.i && piece.j === action.j && !piece.onTarget);
      return state.map(piece => (
        {
          ...piece, 
          dragging: grabbed(piece),
          x: grabbed(piece) ? action.x : piece.x,
          y: grabbed(piece) ? action.y : piece.y
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
          x: isOnTarget(piece) && piece.dragging || piece.onTarget ? piece.tX - piece.size*0.199 : piece.oX,
          y: isOnTarget(piece) && piece.dragging || piece.onTarget ? piece.tY - piece.size*0.199 : piece.oY,
          onTarget: isOnTarget(piece) && piece.dragging || piece.onTarget
        }
      ));
  }
}

function Game() {
  const puzzleSize = [3, 3];
  const length = puzzleSize[0]*puzzleSize[1];
  //HOOKS
  const { img } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [screen, setScreen] = useState({width: window.innerWidth, height: window.innerHeight, xOff: 0, yOff: 0});
  const [boardStyle, setBoardStyle] = useState({});
  const [time, setTime] = useState(80);
  const random = randomize(length);
  const [pieces, dispatch] = useReducer(piecesReducer, Array.from({ length }, (v, n) => {
    const i = Math.floor(n/puzzleSize[1]);
    const j = n - i*puzzleSize[1];
    const iR = Math.floor(random[n]/puzzleSize[1]);
    const jR = random[n] - iR*puzzleSize[1];
    return {
      i, j, iR, jR,
      onTarget: false,
      dragging: false,
      size: (window.innerWidth*0.9)/puzzleSize[1],
      x: 0, y: 0,
      tX: 0, tY: 0
    }
  }));
  //END HOOKS
  //FUNCTIONS
  const onGrab = (e, i, j) => {
    const { xOff, yOff } = screen;
    if(e.type !== 'touchstart') e.preventDefault();
    dispatch({ type: 'grabbed', i, j,
      x: (e.clientX || e.touches?.[0].clientX) - (pieces[0]?.size/2) - xOff, 
      y: (e.clientY || e.touches?.[0].clientY) - (pieces[0]?.size/2) - yOff
    });
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
    const interval = setInterval(()=>setTime(time=>time-1),1000);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    }
  }, [])

  useEffect(()=>{
    const { xOff, yOff } = screen;
    dispatch({
      type: 'set-pieces-size',
      size: (boardStyle.style?.height/puzzleSize[0])/0.6025,
      bX: boardStyle.x - xOff,
      bY: boardStyle.y - yOff    
    });
  }, [boardStyle])

  //WIN/LOSE CONDITIONS
  useEffect(()=>{
    if(time === 0) navigate(`/end/lose`);
    else if(!pieces.some(piece=>!piece.onTarget)) navigate(`/end/win`);
  },[pieces, time])

  return (
    <div ref={pageRef} className={styles.Page} onMouseMove={onDrag}>
      <header>
        <div className={styles.logo}>
          <img src='/assets/img/logo/logo.png' alt='BNA logo' />
        </div>
        <div className={styles.clock}>
          <img src='/assets/img/clock.svg' alt='clock' />
          <span>{`${time}s`}</span>
        </div>
      </header>
      <h2>Armá el rompecabezas antes que se acabe el tiempo</h2>
      <Board 
        size={puzzleSize} scrsize={screen} 
        boardStyle={boardStyle} setBoardStyle={setBoardStyle} 
        img={`/assets/img/puzzle/${img.replace('+', '.')}`} 
      />      
      <div className={styles.table} style={{...boardStyle.style}}>
      {
        Array.from({ length: puzzleSize[0] }, (v, i) => {
              return <div key={`i${i}`} className={styles.row}>
                {
                  Array.from({ length: puzzleSize[1] }, (v, j) => {
                    const piece = pieces.find(piece => piece.iR === i && piece.jR === j);
                    return <Piece
                      img={`/assets/img/puzzle/${img.replace('+', '.')}`}
                      puzzleSize={puzzleSize}
                      key={`${piece.j}${piece.i}`} i={piece.i} j={piece.j} 
                      onGrab={(e)=>onGrab(e, piece.i, piece.j)} 
                      onDrop={(e)=>onDrop(e, piece.i, piece.j)}
                      onDrag={onDrag}
                      style={{
                        position: piece.dragging || piece.onTarget ? 'absolute' : 'unset', 
                        left: piece?.x || 0, 
                        top: piece?.y || 0,
                        width: piece?.dragging || piece?.onTarget ? piece?.size : '100%',
                        height: piece?.dragging || piece?.onTarget ? piece?.size : '100%',
                        cursor: piece.onTarget ? 'default' : piece.dragging ? 'grabbing' : 'grab',
                        zIndex: piece.dragging ? 10 : (piece.onTarget ? 1 : 2),
                        gridColumn: piece.jR+1,
                      }}
                    />
                    })
                }
              </div>
          })
      }
      </div>
    </div>
  )
}

export default Game;
