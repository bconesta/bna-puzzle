import { useNavigate } from 'react-router-dom';
import { randomize } from '../../utils/randomize';
import './Home.scss'

function Home() {

  const navigate = useNavigate();

  const goToNextPage = () => {
    const imgs = ['cultivo+webp', 'granja+webp', 'tractor+webp'];
    navigate(`/game/${imgs[randomize(imgs.length)[0]]}`);
  }
  return (
    <div className='home-page'>
      <div className="header">
        <img src='/assets/img/logo/logo.png' />
      </div>
      <div className="center">
        <h1>¡Bienvenido!</h1>
        <p>¿Podrás armar el rompecabezas antes de que se acabe el tiempo?</p>
        <img src='/assets/img/home/image.png' className='image' />
      </div>
      <div className="button">
        <button onClick={goToNextPage}>Jugar</button>
      </div>
    </div>
  )
}

export default Home