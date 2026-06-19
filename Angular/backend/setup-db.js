const { getConnection, sql } = require('./src/database/connection');

// Script para configurar de forma automática la base de datos SQL Server
const runSetup = async () => {
  try {
    console.log('Conectando a la base de datos para configuración...');
    const pool = await getConnection();
    console.log('Conexión exitosa.');

    // 0. Crear tabla Personas si no existe
    console.log('Verificando/creando tabla Personas...');
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Personas')
      BEGIN
        CREATE TABLE Personas (
          Id INT IDENTITY(1,1) PRIMARY KEY,
          Nombre VARCHAR(100) NOT NULL,
          Apellido VARCHAR(100) NOT NULL,
          Edad INT NOT NULL,
          Correo VARCHAR(150) NOT NULL
        );
        PRINT 'Tabla Personas creada.';
      END
    `);

    // 1. Crear tabla Vendedores si no existe
    console.log('Verificando/creando tabla Vendedores...');
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Vendedores')
      BEGIN
        CREATE TABLE Vendedores (
          Id INT IDENTITY(1,1) PRIMARY KEY,
          Nombre VARCHAR(100) NOT NULL
        );
        PRINT 'Tabla Vendedores creada.';
      END
    `);

    // 2. Insertar vendedores iniciales si la tabla está vacía
    console.log('Insertando datos de prueba en Vendedores si es necesario...');
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM Vendedores)
      BEGIN
        INSERT INTO Vendedores (Nombre) VALUES 
        ('Juan Pérez'),
        ('María Gómez'),
        ('Carlos Rodríguez'),
        ('Ana Martínez');
        PRINT 'Vendedores iniciales insertados.';
      END
    `);

    // 3. Agregar VendedorId a Personas si no existe
    console.log('Verificando/agregando columna VendedorId a Personas...');
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Personas') AND name = 'VendedorId'
      )
      BEGIN
        ALTER TABLE Personas ADD VendedorId INT NULL;
        ALTER TABLE Personas ADD CONSTRAINT FK_Personas_Vendedores 
          FOREIGN KEY (VendedorId) REFERENCES Vendedores(Id);
        PRINT 'Columna VendedorId agregada a Personas.';
      END
    `);

    console.log('Configuración de la base de datos completada con éxito.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la configuración de la base de datos:', error);
    process.exit(1);
  }
};

runSetup();
