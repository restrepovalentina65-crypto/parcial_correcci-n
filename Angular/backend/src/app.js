const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const personasRoutes = require('./routes/personas.routes');

const app = express();

// Configuración de Swagger
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personas y Vendedores API',
      version: '1.0.0',
      description: 'API REST para gestionar personas (clientes) y asignarles vendedores, conectada a SQL Server',
    },
    servers: [
      {
        url: 'http://localhost:4200/',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ruta de escaneo para buscar anotaciones swagger
};

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Documentación de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

// Redirigir la raíz del servidor a la documentación de Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Rutas
app.use('/api', personasRoutes);

module.exports = app;
