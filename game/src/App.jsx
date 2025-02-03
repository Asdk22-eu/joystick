  import { useState } from 'react';
  import InstruccionesDetalladas from './components/InstruccionesDetalladas';
  import Juego from './components/Juego';
  import MusicaFondo from './components/MusicaFondo';
  import './index.css';
import { MusicaProvider } from './components/MusicaContext';
  function App() {
    const [pantalla, setPantalla] = useState('inicio');

    const irAInstrucciones = () => setPantalla('instrucciones');
    const irAJuego = () => setPantalla('juego');
    const volverInicio = () => setPantalla('inicio');

    return (
      <MusicaProvider>
      <div>
        {pantalla === 'inicio' && (
          <div className="pantalla-inicio"> 
            <div className="contenedor-titulo">
              <h1 className="titulo-juego">COLORFALL</h1>
              <button className="btn-play" onClick={irAInstrucciones}>PLAY</button>
            </div>
           
             
          </div>
        )}

        {pantalla === 'instrucciones' && (
          <InstruccionesDetalladas 
            volverInicio={volverInicio} 
            irAJuego={irAJuego} 
          />
        )}

        {pantalla === 'juego' && <Juego />}
      </div>
      </MusicaProvider>

    );
  }

  export default App;
