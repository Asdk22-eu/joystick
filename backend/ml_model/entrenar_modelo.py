import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Corregir la ruta del archivo CSV subiendo un nivel

ruta_dataset = r"D:\Universidad\7-Septimo\Interaccion Humano Computador\Proyecto TOTAL\Game\dataset\historial_jugadores.csv"
print("Ruta del archivo CSV:", ruta_dataset)  # Verificar ruta absoluta

try:
    df = pd.read_csv(ruta_dataset)
    X = df[['puntaje', 'tiempo', 'vidas']]
    y = df['nivel']

    # Dividir datos en entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Entrenar el modelo
    modelo = RandomForestClassifier(n_estimators=100, random_state=42)
    modelo.fit(X_train, y_train)

    # Guardar el modelo entrenado
    ruta_modelo = os.path.join(os.path.dirname(__file__), 'modelo_niveles.pkl')
    with open(ruta_modelo, 'wb') as f:
        pickle.dump(modelo, f)

    print("Modelo entrenado y guardado en:", ruta_modelo)

except FileNotFoundError:
    print("Error: No se encontró el archivo de datos.")
except Exception as e:
    print(f"Error inesperado: {e}")
