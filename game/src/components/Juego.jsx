import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './juego.css';
import MusicaFondo from './MusicaFondo';

function Juego() {
  const [colores, setColores] = useState(['rojo', 'amarillo', 'verde', 'azul']);
  const [colorObjetivo, setColorObjetivo] = useState('');
  const [posicionCanasta, setPosicionCanasta] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [modoIA, setModoIA] = useState(false); // false = modo manual, true = modo IA
  const [inicioTiempo, setInicioTiempo] = useState(Date.now());
  const [pausado, setPausado] = useState(false);
  const [tiempoJugado, setTiempoJugado] = useState(0);

  useEffect(() => {
    setInicioTiempo(Date.now());
    generarColorObjetivo();
  }, []);

  const calcularTiempoTranscurrido = () => {
    return Math.floor((Date.now() - inicioTiempo) / 1000);
  };

  const generarColorObjetivo = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setColorObjetivo(randomColor);
  };
//funcionalidad del juego
  useEffect(() => {
    const manejarTecla = (evento) => {
      if(evento.code == 'Escape'){
        togglePausa();
      }
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
    return () => window.removeEventListener('keydown', manejarTecla);
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
      setPuntos(puntos + 1);
      generarColorObjetivo();
    } else {
      setVidas(vidas - 1);
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

    if (!modoIA) {
      guardarDatosLocalmente(datos);
    } else {
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
    }
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
    alert('Datos guardados localmente.');
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
      <div className="info">
        <div className="vidas">Vidas: {vidas}</div>
        <div className="puntos">Puntos: {puntos}</div>
        <div className="nivel">Nivel: {nivel}</div>
      </div>

      <div className="indicador-color">
        <p>Selecciona el color:</p>
        <div className={`color-muestra ${colorObjetivo}`}>{colorObjetivo.toUpperCase()}</div>
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

      <div className='botones-contenedor'>
          <button className="confirmar" onClick={confirmarSeleccion}>
            Confirmar
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

    </div>
  );
}

export default Juego;
