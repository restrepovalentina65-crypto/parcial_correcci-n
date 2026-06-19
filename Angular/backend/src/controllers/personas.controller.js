const { getConnection, sql } = require('../database/connection');

// GET /api/personas
// Obtiene la lista de personas realizando un LEFT JOIN con la tabla Vendedores
// para retornar el ID y Nombre del vendedor asignado.
const getAll = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT P.Id, P.Nombre, P.Apellido, P.Edad, P.Correo, P.VendedorId, V.Nombre AS VendedorNombre
      FROM Personas P
      LEFT JOIN Vendedores V ON P.VendedorId = V.Id
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/personas/:id
// Obtiene una persona específica por su ID, incluyendo el vendedor asociado
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query(`
        SELECT P.Id, P.Nombre, P.Apellido, P.Edad, P.Correo, P.VendedorId, V.Nombre AS VendedorNombre
        FROM Personas P
        LEFT JOIN Vendedores V ON P.VendedorId = V.Id
        WHERE P.Id = @Id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/personas
// Crea una nueva persona, asociando opcionalmente un vendedorId
const create = async (req, res) => {
  // Se desestructura VendedorId/vendedorId del cuerpo de la petición
  const { Nombre, Apellido, Edad, Correo, VendedorId, vendedorId } = req.body;
  if (!Nombre || !Apellido || !Edad || !Correo) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Normalizar el ID del vendedor para soportar tanto camelCase como PascalCase
  const vId = VendedorId !== undefined ? VendedorId : (vendedorId !== undefined ? vendedorId : null);

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Nombre', sql.VarChar, Nombre)
      .input('Apellido', sql.VarChar, Apellido)
      .input('Edad', sql.Int, Edad)
      .input('Correo', sql.VarChar, Correo)
      .input('VendedorId', sql.Int, vId)
      .query(`
        INSERT INTO Personas (Nombre, Apellido, Edad, Correo, VendedorId) 
        OUTPUT INSERTED.Id 
        VALUES (@Nombre, @Apellido, @Edad, @Correo, @VendedorId)
      `);
    
    res.status(201).json({ 
      Id: result.recordset[0].Id, 
      Nombre, 
      Apellido, 
      Edad, 
      Correo, 
      VendedorId: vId 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/personas/:id
// Actualiza una persona existente, permitiendo cambiar el vendedorId asignado
const update = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Edad, Correo, VendedorId, vendedorId } = req.body;
  if (!Nombre || !Apellido || !Edad || !Correo) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }


  const vId = VendedorId !== undefined ? VendedorId : (vendedorId !== undefined ? vendedorId : null);

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Nombre', sql.VarChar, Nombre)
      .input('Apellido', sql.VarChar, Apellido)
      .input('Edad', sql.Int, Edad)
      .input('Correo', sql.VarChar, Correo)
      .input('VendedorId', sql.Int, vId)
      .query(`
        UPDATE Personas SET 
          Nombre = @Nombre, 
          Apellido = @Apellido, 
          Edad = @Edad, 
          Correo = @Correo,
          VendedorId = @VendedorId 
        WHERE Id = @Id
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json({ message: 'Persona actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/personas/:id
// Elimina una persona por su ID
const deletePersona = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Personas WHERE Id = @Id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/persona/vendedores
// Obtiene la lista de todos los vendedores disponibles
const getVendedores = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Vendedores ORDER BY Nombre');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/personas/buscarPornombre
// Busca personas o clientes por nombre
const buscarPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      return res.status(400).json({ message: 'El parámetro nombre es obligatorio para la búsqueda' });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('Nombre', sql.VarChar, `%${nombre}%`)
      .query(`
        SELECT P.Id, P.Nombre, P.Apellido, P.Edad, P.Correo, P.VendedorId, V.Nombre AS VendedorNombre
        FROM Personas P
        LEFT JOIN Vendedores V ON P.VendedorId = V.Id
        WHERE P.Nombre LIKE @Nombre OR P.Apellido LIKE @Nombre
      `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deletePersona,
  getVendedores,
  buscarPorNombre
};
