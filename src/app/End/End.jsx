import React, { useEffect } from 'react'
import './End.scss'
import Confetti from 'react-confetti'
import { useParams } from 'react-router-dom';
//import {useWindowSize} from '@react-hook/window-size'

function End() {
  //const [width, height] = useWindowSize()
  const width = window.innerWidth;
  const height = window.innerHeight;

  const { status } = useParams();

  const goToNextPage = () => {
    window.location.href = '/'
  }

  useEffect(() => {
    setTimeout(() => {
      goToNextPage()
    }, 6000)
  }, [])

  return (
    <div className='end-page'>
      {status === 'win' && <Confetti
        width={width}
        height={height}
        colors={['#8F8ABD', '#F06C29', '#007B5F', '#507385', '#D4AC87', '#65C9D8']}
        recycle={true}
        numberOfPieces={500}
    	/>}
      <div className="header">
        <img src='/assets/img/logo/logo.png' />
      </div>
      <div className="center">
        {status === 'win' ?
        <>
          <h1>¡Excelente!</h1>
          <p>Muchas gracias por jugar</p>
          <img src='/assets/img/trofeo.png' className='trophy'/>
        </>
        :
        <>
          <h2>¡Se te acabó el tiempo!</h2>
          <p>Gracias por participar</p>
          <img src='/assets/img/reloj.png' className='clock'/>
        </>
      }
      </div>
    </div>
  )
}

export default End