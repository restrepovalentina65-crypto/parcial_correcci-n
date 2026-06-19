require('dotenv').config();
const app = require('./app');
const { getConnection } = require('./database/connection');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Probar conexión a la BD
    await getConnection();
    console.log('Base de datos conectada correctamente');
    
    app.listen(PORT, () => {
      console.log(`Servidor de la API corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
};

startServer();
