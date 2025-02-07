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
  const [modoIA, setModoIA] = useState(false);
  const [inicioTiempo, setInicioTiempo] = useState(Date.now());
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    setInicioTiempo(Date.now());
    console.log("🔥 Juego montado correctamente");
    generarColorObjetivo();
  }, []);

  const guardarDatosEnMongoDB = async (datos) => {
    try {
      await axios.post('http://127.0.0.1:5000/guardar_datos', {
        ...datos,
        nivel: nivel
      });
      mostrarAlerta('Datos guardados en la base de datos');
    } catch (error) {
      console.error('Error al guardar datos:', error);
      mostrarAlerta('Error al guardar los datos en la base de datos');
    }
  };
  
  const calcularTiempoTranscurrido = () => {
    return Math.floor((Date.now() - inicioTiempo) / 1000);
  };

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

  const manejarFinDeRonda = async () => {

    const datos = {
      puntaje: puntos,
      tiempo: calcularTiempoTranscurrido(),
      vidas: vidas,
    };

    if (!modoIA) {
      await guardarDatosEnMongoDB(datos);
      console.log("Enviando datos:", datos);
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:5000/predecir', datos);
        const nivelPredicho = response.data.nivel_predicho;
        setNivel(nivelPredicho);
        mostrarAlerta(`Nivel sugerido: ${nivelPredicho}`);
        ajustarDificultad(nivelPredicho);
      } catch (error) {
        console.error('Error al obtener la predicción:', error);
        mostrarAlerta('No se pudo obtener la predicción del nivel.');
      }
    }
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
          manejarFinDeRonda();
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



  const ajustarDificultad = (nivelPredicho) => {
    if (nivelPredicho > nivel) {
      setColores([...colores, 'morado', 'naranja']);
    } else if (nivelPredicho < nivel) {
      setColores(['rojo', 'amarillo', 'verde', 'azul']);
    }
  };

  const guardarDatosLocalmente = (datos) => {
    const datosPrevios = JSON.parse(localStorage.getItem('datosJuego')) || [];
    datosPrevios.push(datos);
    localStorage.setItem('datosJuego', JSON.stringify(datosPrevios));
    mostrarAlerta('Datos guardados localmente.');
  };

  const alternarModoIA = () => {
    setModoIA(!modoIA);
  };
  //juego pausado.
  const togglePausa = () => {
    setPausado(!pausado);
  };

  const salirJuego = () => {
    const confirmar = window.confirm('¿Estás seguro que deseas salir del juego?');
    if (confirmar) {
      window.location.href = '/';
    }
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
        <button className={`modo-ia ${modoIA ? 'activo' : 'inactivo'}`} onClick={alternarModoIA}>
              {modoIA ? 'Con IA' : 'Sin IA'}
        </button>

        <button className='boton-pausa' onClick={togglePausa}>
              Pausar
            </button>
        
      </div>

      {pausado && (
          <div className="modal-pausa">
            <div className="modal-contenido">
              <h2>Juego Pausado</h2>
              
              <div className="resumen-juego">
                <h3>Resumen del Juego</h3>
                <p>Puntos conseguidos 🏆: {puntos}</p>
                <p>Nivel actual ⭐: {nivel}</p>
                <p>Vidas restantes ❤️: {vidas}</p>
                <p>Modo: {modoIA ? 'IA' : 'Manual'}</p>
              </div>
              

              <div className="botones-pausa">
                <button className="boton-reanudar" onClick={togglePausa}>
                  Reanudar Juego
                </button> 
                <button className="boton-reiniciar" onClick={reiniciarJuego}>
                  Reiniciar Juego
                </button>
                <button className="boton-salir" onClick={salirJuego}>
                  Salir del Juego
                </button>
                <MusicaFondo/>
              </div>
          
            </div>
            
          </div>
        )}

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
