import React, { useEffect, useState } from 'react'
import './StatsViewer.scss'

//El JSON de estadisticas se guarda en el localStorage con la siguiente estructura:
// {
//     "dia": cantidadDeVecesJugadas,
//     "dia": cantidadDeVecesJugadas,
//     ...
// }

function StatsViewer({whenClose, storageKey}) {
    const [estadisticas, setEstadisticas] = useState({})
    useEffect(() => {
        readData();
    }, [])

    const readData = () => {
        const jsonData = localStorage.getItem(storageKey);
        if (jsonData) {
            setEstadisticas(JSON.parse(jsonData));
        }
    }

    const deleteData = () => { 
        localStorage.removeItem(storageKey);
        setEstadisticas({});
    }

    const firstWarning = () => {
        let result = window.confirm("¿Estas seguro que deseas borrar todos los datos?");
        if (result) {
            let result = window.confirm("Se borraran todos los datos, ¿Estas seguro?");
            if (result) {
                deleteData();
            }
        }
    }

  return (
    <div className="stats-viewer-bg">
        <div className='stats-viewer-component'>
            <button className='close-button' onClick={whenClose}>Cerrar</button>
            <h2>Cantidad de veces jugadas:</h2>
            {Object.keys(estadisticas).length > 0 ? Object.entries(estadisticas).map(([dia, value]) => (
            <div key={dia}>
                <p>{dia}: {value}</p>
            </div>
            ))
            :
            <p>No hay datos</p>
            }
            {Object.keys(estadisticas).length > 0 && <button className='delete-button' onClick={firstWarning}>Borrar datos</button>}
        </div>
    </div>

  )
}

export default StatsViewer