import React, { useEffect, useRef, useState } from 'react';
import './InstruccionesDetalladas.css'
import MusicaFondo from './MusicaFondo';
import ReyJulien from '../assets/ReyJulien.png'


const InstruccionesDetalladas = ({ volverInicio, irAJuego }) => {
  const [audioActivo, setAudioActivo] = useState(true);
  const audioRef = useRef(new Audio('/instrucciones.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  

  const reproducirAudio = () => {
    if (audioActivo) {
      audio.play();
    }
  };



  useEffect(()=>{
    const audio =audioRef.current;
    audio.volume = 0.5;
    audio.loop = false;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    }

  },[]);

  const alternarAudio = () => {
    const audio = audioRef.current;
    if(audioActivo){
      audio.pause();
    }else{
      audio.play().catch(err => console.error('Error al reproducir audio: ', err));
    }
    setAudioActivo(!audioActivo);
  };

  return (
    <div className="pantalla-instrucciones">
      <div className="cuadro-instrucciones">
        <h2>INSTRUCCIONES DETALLADAS</h2>

        <ul>
          <li>Utiliza el joystick para moverte hacia el color indicado.</li>
          <li>Presiona <b>ESPACIO</b> para confirmar el color que escogiste.</li>
          <li>Evita los colores incorrectos para no perder vidas.</li>
        </ul>

        <div className="botones-audio">
          <button onClick={alternarAudio}>
            {audioActivo ? '🔇 Parar Instrucciones' : ' 🔈Reproducir Instrucciones'}
          </button>
          <MusicaFondo/>
        </div>

        <button className="btn-volver" onClick={volverInicio}>⬅ Volver</button>
        <button className="btn-siguiente" onClick={irAJuego}> Siguiente ➡</button>
      </div>
    </div>
  );
};

export default InstruccionesDetalladas;
