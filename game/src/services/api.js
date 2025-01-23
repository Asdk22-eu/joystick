import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/predecir'; // URL de tu backend Flask

export const enviarDatosJuego = async (datos) => {
  try {
    const response = await axios.post(API_URL, datos, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.nivel_predicho; // Suponiendo que el backend devuelve { "nivel_predicho": valor }
  } catch (error) {
    console.error('Error al enviar datos al backend:', error);
    return null;
  }
};
