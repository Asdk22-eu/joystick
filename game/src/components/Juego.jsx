import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import './juego.css';
import MusicaFondo from './MusicaFondo';
import errorSound from '../assets/error.mp3';
import { JoystickContext } from "../context/JoystickContext";

function Juego() {
  const { joystickData, connectJoystick } = useContext(JoystickContext);
  const [colores, setColores] = useState(['rojo', 'amarillo', 'verde', 'azul']);
  const [colorObjetivo, setColorObjetivo] = useState('');
  const [posicionCanasta, setPosicionCanasta] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [alerta, setAlerta] = useState({ visible: false, mensaje: '' });
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [botonPresionado, setBotonPresionado] = useState(false);
  const audioError = new Audio(errorSound);

  useEffect(() => {
    console.log("🔥 Juego montado correctamente");
    generarColorObjetivo();
  }, []);

  const generarColorObjetivo = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorObjetivo(randomColor);
  };

  const mostrarAlerta = (mensaje) => {
    setAlerta({ visible: true, mensaje });
  };

  const cerrarAlerta = () => {
    setAlerta({ visible: false, mensaje: '' });
    if (juegoTerminado) {
      reiniciarJuego();
    }
  };

  useEffect(() => {
    if (joystickData && !juegoTerminado) {
      const { x, button } = joystickData;

      if (x < -300 && posicionCanasta > 0) {
        moverCanasta('izquierda');
      } else if (x > 300 && posicionCanasta < colores.length - 1) {
        moverCanasta('derecha');
      }

      if (button === 1 && !botonPresionado) {
        confirmarSeleccion();
        setBotonPresionado(true);
        setTimeout(() => setBotonPresionado(false), 300);
      }
    }
  }, [joystickData, juegoTerminado]);

  const moverCanasta = (direccion) => {
    setPosicionCanasta((prevPos) => {
      if (direccion === 'izquierda') {
        return prevPos > 0 ? prevPos - 1 : prevPos;
      } else if (direccion === 'derecha') {
        return prevPos < colores.length - 1 ? prevPos + 1 : prevPos;
      }
      return prevPos;
    });
  };

  const confirmarSeleccion = () => {
    console.log(`🎯 Intento con color: ${colores[posicionCanasta]}, Objetivo: ${colorObjetivo}`);

    if (juegoTerminado) return;

    if (colores[posicionCanasta] === colorObjetivo) {
      setPuntos((prev) => prev + 1);
      setTimeout(() => {
        setColorObjetivo(colores[Math.floor(Math.random() * colores.length)]);
      }, 50);
    } else {
      setVidas((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          setJuegoTerminado(true);
          mostrarAlerta(`🛑 Juego terminado. Puntos totales: ${puntos}`);
          return 0;
        }
      });
      reproducirError();
    }
  };

  const reproducirError = () => {
    audioError.currentTime = 0;
    audioError.play().catch(err => console.error("Error al reproducir sonido:", err));
  };

  const reiniciarJuego = () => {
    console.log("🔄 Reiniciando juego...");
    setJuegoTerminado(false);
    setVidas(3);
    setPuntos(0);
    setPosicionCanasta(0);
    setNivel(1);
    generarColorObjetivo();
  };

  return (
    <div className="juego">
      <button className="conectar-joystick" onClick={connectJoystick}>
        🎮 Conectar Joystick
      </button>

      <div className="info">
        <div className="vidas">❤️ Vidas: {vidas}</div>
        <div className="puntos">🏆 Puntos: {puntos}</div>
        <div className="nivel">⭐ Nivel: {nivel}</div>
      </div>

      <div className="indicador-color">
        <p>Selecciona el color:</p>
        <div className={`color-muestra ${colorObjetivo}`}>{colorObjetivo.toUpperCase()}</div>
      </div>

      <div className="contenedor-colores">
        {colores.map((color, index) => (
          <div key={index} className={`color ${color} ${posicionCanasta === index ? 'seleccionado' : ''}`}>
          </div>
        ))}
      </div>

      <div className="canasta">
        <button onClick={() => moverCanasta('izquierda')}>←</button>
        <button onClick={() => moverCanasta('derecha')}>→</button>
      </div>

      <div className='botones-contenedor'>
        <button className="confirmar" onClick={confirmarSeleccion} disabled={juegoTerminado}>
          ✅ Confirmar
        </button>
        <button className="botonia">
              Con Ia
            </button>
        <button className='boton-pausa' >
              Pausar
            </button>
        
      </div>

      {alerta.visible && (
        <div className="modal-alerta">
          <div className="modal-contenido">
            <h2>Mensaje</h2>
            <p>{alerta.mensaje}</p>
            <button className="boton-cerrar" onClick={cerrarAlerta}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Juego;
