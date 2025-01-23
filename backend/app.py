from flask import Flask, request, jsonify
import pandas as pd
import os
from flask_cors import CORS


app = Flask(__name__)
@app.route('/')
def home():
    return "Bienvenido a la API"

@app.route('/prediccion')
def prediccion():
    return "Aquí se manejarán las predicciones"
# Ruta del archivo CSV
ruta_csv = r"D:\Universidad\7-Septimo\Interaccion Humano Computador\Proyecto TOTAL\Game\dataset\historial_jugadores.csv"

# Crear el archivo CSV si no existe
if not os.path.exists(ruta_csv):
    df = pd.DataFrame(columns=['puntaje', 'tiempo', 'vidas', 'nivel'])
    df.to_csv(ruta_csv, index=False)

@app.route('/guardar_datos', methods=['POST'])
def guardar_datos():
    datos = request.get_json()
    nuevo_dato = pd.DataFrame([datos])
    nuevo_dato.to_csv(ruta_csv, mode='a', header=False, index=False)
    return jsonify({"mensaje": "Datos guardados correctamente"}), 200

if __name__ == '__main__':
    app.run(debug=True)
    
CORS(app)