import { useState, useEffect } from 'react';
import InstruccionesDetalladas from './components/InstruccionesDetalladas';
import Juego from './components/Juego';
import JoystickProvider from "./context/JoystickContext";
import MusicaFondo from './components/MusicaFondo';
import { MusicaProvider } from './components/MusicaContext';
import './index.css';

function App() {
  const [pantalla, setPantalla] = useState('inicio');

  useEffect(() => {
    console.log("Pantalla actual:", pantalla); // 🔥 Depuración: Verificar si la pantalla cambia
  }, [pantalla]);

  return (
    <MusicaProvider>
      <JoystickProvider>
        <div>
          {pantalla === 'inicio' && (
            <div className="pantalla-inicio">
              <div className="contenedor-titulo">
                <h1 className="titulo-juego">COLORFALL</h1>
                <button className="btn-play" onClick={() => setPantalla('instrucciones')}>
                  PLAY
                </button>
              </div>
            </div>
          )}

          {pantalla === 'instrucciones' && (
            <InstruccionesDetalladas 
              volverInicio={() => setPantalla('inicio')}
              irAJuego={() => setPantalla('juego')} 
            />
          )}

          {pantalla === 'juego' && <Juego />}
        </div>
      </JoystickProvider>
    </MusicaProvider>
  );
}

export default App;
