export const enviarDatosJuego = async (datos) => {
    try{
        const response = await fetch('http://127.0.0.1:5000/predecir',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

    }catch (error){
        console.error('Error al predecir el nivel', error);
    }
};