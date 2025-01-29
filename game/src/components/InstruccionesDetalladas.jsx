import React, { useState } from 'react';

const InstruccionesDetalladas = ({ volverInicio, irAJuego }) => {
  const [audioActivo, setAudioActivo] = useState(true);
  const [audio] = useState(new Audio('/audios/instruccion1.mp3'));

  const reproducirAudio = () => {
    if (audioActivo) {
      audio.play();
    }
  };

  const alternarAudio = () => {
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
          <button onClick={reproducirAudio}>🔊 Reproducir Audio</button>
          <button onClick={alternarAudio}>
            {audioActivo ? '🔈 Silenciar' : '🔇 Activar Sonido'}
          </button>
        </div>

        <button className="btn-volver" onClick={volverInicio}>⬅ Volver</button>
        <button className="btn-siguiente" onClick={irAJuego}> Siguiente ➡</button>
      </div>
    </div>
  );
};

export default InstruccionesDetalladas;
