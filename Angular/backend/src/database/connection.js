const sql = require('mssql');
const path = require('path');

// Cargar variables de entorno usando una ruta absoluta basada en este archivo
// Esto garantiza que se cargue la configuración independientemente de desde dónde se inicie el servidor
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || 1433),
  options: {
    encrypt: true, // true para azure
    trustServerCertificate: true, // true para desarrollo local
  },
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
};

module.exports = { getConnection, sql };
