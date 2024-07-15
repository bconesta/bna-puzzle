import { useNavigate } from 'react-router-dom';
import { randomize } from '../../utils/randomize';
import React, {useState} from 'react'
import './Home.scss'
import StatsViewer from '../../components/StatsViewer/StatsViewer';
import SecretButton from '../../components/SecretButton/SecretButton';

function Home() {
  const [showStats, setShowStats] = useState(false);

  const navigate = useNavigate();

  const goToNextPage = () => {
    const imgs = ['cultivo+webp', 'granja+webp', 'tractor+webp'];
    navigate(`/game/${imgs[randomize(imgs.length)[0]]}`);
  }
  return (
    <div className='home-page'>
      <div style={{position: 'absolute', top: 0, left: 0, width: '15vw', height: '15vw'}}>
        <SecretButton whenClicked={() => setShowStats(true)} totalClicks={2}/>
      </div>
      {showStats && <StatsViewer whenClose={()=>{setShowStats(false)}} storageKey={'stats-puzzle-bna'}/>}
      <div className="header">
        <img src='/assets/img/logo/logo.png' />
      </div>
      <div className="center">
        <h1>¡Bienvenido!</h1>
        <p>Armá el rompecabezas antes de que se acabe el tiempo</p>
        <img src='/assets/img/home/image.png' className='image' />
      </div>
      <div className="button">
        <button onClick={goToNextPage}>Jugar</button>
      </div>
    </div>
  )
}

export default Home
