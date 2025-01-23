import React from 'react';

const PantallaInicio = ({ comenzarJuego }) => {
  return (
    <div className="pantalla-inicio">
      <div className="explosion">
        <h1>COLORFALL</h1>
        <button onClick={comenzarJuego}>PLAY</button>
      </div>
    </div>
  );
};

export default PantallaInicio;
