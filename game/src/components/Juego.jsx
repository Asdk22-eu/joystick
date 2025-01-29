import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './juego.css';

function Juego() {
  const [colores, setColores] = useState(['rojo', 'amarillo', 'verde', 'azul']);
  const [colorObjetivo, setColorObjetivo] = useState('');
  const [posicionCanasta, setPosicionCanasta] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);  // Nivel del juego
  const [inicioTiempo, setInicioTiempo] = useState(Date.now());

  useEffect(() => {
    setInicioTiempo(Date.now());
  }, []);

  const calcularTiempoTranscurrido = () => {
    const tiempoActual = Date.now();
    return Math.floor((tiempoActual - inicioTiempo) / 1000);
  };

  useEffect(() => {
    generarColorObjetivo();
  }, []);

  const generarColorObjetivo = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorObjetivo(randomColor);
  };

  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.code === 'Space') {
        evento.preventDefault();
        confirmarSeleccion();
      } else if (evento.code === 'ArrowLeft') {
        moverCanasta('izquierda');
      } else if (evento.code === 'ArrowRight') {
        moverCanasta('derecha');
      }
    };

    window.addEventListener('keydown', manejarTecla);

    return () => {
      window.removeEventListener('keydown', manejarTecla);
    };
  }, [posicionCanasta, vidas, puntos, colorObjetivo]);

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
      manejarFinDeRonda();
      reiniciarJuego();
    }
  };

  const reiniciarJuego = () => {
    setVidas(3);
    setPuntos(0);
    setPosicionCanasta(0);
    setNivel(1);
    generarColorObjetivo();
  };

  const manejarFinDeRonda = async () => {
    const datos = {
      puntaje: puntos,
      tiempo: calcularTiempoTranscurrido(),
      vidas: vidas,
    };
    
    console.log("Datos enviados a la API:", datos);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predecir', datos);
      const nivelPredicho = response.data.nivel_predicho;
      setNivel(nivelPredicho);

      alert(`Nivel sugerido: ${nivelPredicho}`);
      ajustarDificultad(nivelPredicho);
    } catch (error) {
      console.error('Error al obtener la predicción:', error);
      alert('No se pudo obtener la predicción del nivel.');
    }
  };

  const ajustarDificultad = (nivelPredicho) => {
    if (nivelPredicho > nivel) {
      setColores([...colores, 'morado', 'naranja']);
    } else if (nivelPredicho < nivel) {
      setColores(['rojo', 'amarillo', 'verde', 'azul']);
    }
  };

  return (
    <div className="juego">
      <div className="info">
        <div className="vidas">Vidas: {vidas}</div>
        <div className="puntos">Puntos: {puntos}</div>
        <div className="nivel">Nivel: {nivel}</div>
      </div>

      <div className="indicador-color">
        <p>Selecciona el color:</p>
        <div className={`color-muestra ${colorObjetivo}`}>
          {colorObjetivo.toUpperCase()}
        </div>
      </div>

      <div className="contenedor-colores">
        {colores.map((color, index) => (
          <div
            key={index}
            className={`color ${color} ${posicionCanasta === index ? 'seleccionado' : ''}`}
          ></div>
        ))}
      </div>

      <div className="canasta">
        <button onClick={() => moverCanasta('izquierda')}>←</button>
        
        <button onClick={() => moverCanasta('derecha')}>→</button>
      </div>

      <button className="confirmar" onClick={confirmarSeleccion}>
        Confirmar (Espacio)
      </button>
    </div>
  );
}

export default Juego;
