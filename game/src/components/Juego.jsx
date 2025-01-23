import React, { useState, useEffect } from 'react';
import './juego.css';
import { enviarDatosJuego } from '../services/api';

function Juego() {
  const [colores, setColores] = useState(['rojo', 'amarillo', 'verde', 'azul']);
  const [colorObjetivo, setColorObjetivo] = useState('');
  const [posicionCanasta, setPosicionCanasta] = useState(0); // Posición inicial
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);

  // Generar color objetivo al iniciar
  useEffect(() => {
    generarColorObjetivo();
  }, []);

  // Escuchar la tecla espacio para confirmar
  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.code === 'Space') {
        evento.preventDefault(); // Evitar que la página se desplace
        confirmarSeleccion();
      } else if (evento.code === 'ArrowLeft') {
        moverCanasta('izquierda');
      } else if (evento.code === 'ArrowRight') {
        moverCanasta('derecha');
      }
    };

    window.addEventListener('keydown', manejarTecla);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener('keydown', manejarTecla);
    };
  }, [posicionCanasta, vidas, puntos, colorObjetivo]);

  const generarColorObjetivo = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorObjetivo(randomColor);
  };

  const moverCanasta = (direccion) => {
    if (direccion === 'izquierda' && posicionCanasta > 0) {
      setPosicionCanasta(posicionCanasta - 1);
    } else if (direccion === 'derecha' && posicionCanasta < colores.length - 1) {
      setPosicionCanasta(posicionCanasta + 1);
    }
  };

  const confirmarSeleccion = () => {
    if (colores[posicionCanasta] === colorObjetivo) {
      setPuntos((prevPuntos) => prevPuntos + 1);
      generarColorObjetivo();
    } else {
      setVidas((prevVidas) => prevVidas - 1);
    }

    if (vidas === 1) {
      alert('Juego terminado. Puntos totales: ' + puntos);
      reiniciarJuego();
    }
  };

  const reiniciarJuego = () => {
    setVidas(3);
    setPuntos(0);
    setPosicionCanasta(0);
    generarColorObjetivo();
  };

  //Enviar datos api
  const manejarFinDeRonda = async () => {
    const datos = {
      puntaje: puntos,
      tiempo: TiempoTranscrurrido,
      vidas: vidas,
    };
    const nivelSugerido = await enviarDatosJuego(datos);
    console.log('Muevo nivel sugerido: ', nivelSugerido);
  };

  return (
    <div className="juego">
      <div className="info">
        <div className="vidas">Vidas: {vidas}</div>
        <div className="puntos">Puntos: {puntos}</div>
      </div>

      <div className="indicador-color">
        <p>Selecciona el color:</p>
        <div className={`color-muestra ${colorObjetivo}`}>{colorObjetivo.toUpperCase()}</div>
      </div>

      <div className="contenedor-colores">
        {colores.map((color, index) => (
          <div
            key={index}
            className={`color ${color} ${
              posicionCanasta === index ? 'seleccionado' : ''
            }`}
          ></div>
        ))}
      </div>

      <div className="canasta">
        <button onClick={() => moverCanasta('izquierda')}>←</button>
        <div className="cesta"></div>
        <button onClick={() => moverCanasta('derecha')}>→</button>
      </div>

      <button className="confirmar" onClick={confirmarSeleccion}>
        Confirmar (Espacio)
      </button>
    </div>
  );
}

export default Juego;
