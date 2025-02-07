from pymongo import MongoClient
from datetime import datetime

class MongoDB:
    def __init__(self):
        # Connect to MongoDB (adjust the connection string as needed)
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['game_db']
        self.collection = self.db['player_history']

    def save_game_data(self, data):
        """Save game data with timestamp"""
        data['timestamp'] = datetime.utcnow()
        return self.collection.insert_one(data)

    def get_all_data(self):
        """Retrieve all game data for training"""
        return list(self.collection.find({}, {'_id': 0}))
    


from flask import Flask, request, jsonify
import pandas as pd
import os
from flask_cors import CORS
import joblib



app = Flask(__name__)
CORS(app)

db = MongoDB()

@app.route('/')
def home():
    return "Bienvenido a la API"

# Ruta del archivo CSV
ruta_csv = r"D:\Universidad\7-Septimo\Interaccion Humano Computador\Proyecto TOTAL\Game\dataset\historial_jugadores.csv"

# Crear el archivo CSV si no existe
if not os.path.exists(ruta_csv):
    df = pd.DataFrame(columns=['puntaje', 'tiempo', 'vidas', 'nivel'])
    df.to_csv(ruta_csv, index=False)

@app.route('/guardar_datos', methods=['POST'])
def guardar_datos():
    datos = request.get_json()
    if not all(key in datos for key in ['puntaje', 'tiempo', 'vidas', 'nivel']):
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    try:
        db.save_game_data(datos)
        return jsonify({"mensaje": "Datos guardados correctamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Funcion para cargadr el modelo
def cargar_modelo():
    ruta_modelo = r"D:\Universidad\7-Septimo\Interaccion Humano Computador\Proyecto TOTAL\Game\backend\ml_model\modelo_niveles.pkl"
    if os.path.exists(ruta_modelo):
        return joblib.load(ruta_modelo)
    else:
        raise FileNotFoundError("El modelo no se encuentra en la ruta especificada.")


#Ruta para crear las prediciones
@app.route('/predecir', methods=['POST'])
def predecir():
    try:
        datos = request.get_json()
        if not all(key in datos for key in ['puntaje', 'tiempo', 'vidas']):
            return jsonify({"error": "Datos de entrada incompletos"}), 400

        modelo = cargar_modelo()
        entrada = [[datos['puntaje'], datos['tiempo'], datos['vidas']]]
        prediccion = modelo.predict(entrada)
        return jsonify({'nivel_predicho': int(prediccion[0])})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)