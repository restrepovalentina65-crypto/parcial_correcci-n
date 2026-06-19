const { Router } = require('express');
const personasCtrl = require('../controllers/personas.controller');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: El ID autogenerado de la persona
 *         Nombre:
 *           type: string
 *           description: El nombre de la persona
 *         Apellido:
 *           type: string
 *           description: El apellido de la persona
 *         Edad:
 *           type: integer
 *           description: La edad de la persona
 *         Correo:
 *           type: string
 *           description: El correo electrónico de la persona
 *         VendedorId:
 *           type: integer
 *           description: El ID del vendedor asociado (puede ser nulo)
 *         VendedorNombre:
 *           type: string
 *           description: El nombre del vendedor asociado (retornado en listados y búsquedas)
 *       required:
 *         - Nombre
 *         - Apellido
 *         - Edad
 *         - Correo
 *       example:
 *         Nombre: Juan
 *         Apellido: Perez
 *         Edad: 30
 *         Correo: juan.perez@example.com
 *         VendedorId: 1
 *     Vendedor:
 *       type: object
 *       properties:
 *         Id:
 *           type: integer
 *           description: El ID autogenerado del vendedor
 *         Nombre:
 *           type: string
 *           description: El nombre completo del vendedor
 *       example:
 *         Id: 1
 *         Nombre: Juan Pérez
 */

/**
 * @swagger
 * /api/personas:
 *   get:
 *     summary: Obtiene la lista de todas las personas
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Lista de personas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Persona'
 */
router.get('/personas', personasCtrl.getAll);

/**
 * @swagger
 * /api/personas/buscar:
 *   get:
 *     summary: Busca personas o clientes por nombre o apellido
 *     tags: [Personas]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: El nombre o apellido de la persona a buscar
 *     responses:
 *       200:
 *         description: Lista de personas que coinciden con el término de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Persona'
 *       400:
 *         description: El parámetro nombre es obligatorio para realizar la búsqueda
 */
router.get('/personas/buscar', personasCtrl.buscarPorNombre);

/**
 * @swagger
 * /api/personas/{id}:
 *   get:
 *     summary: Obtiene una persona por su Id
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El Id de la persona a consultar
 *     responses:
 *       200:
 *         description: La persona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona no encontrada
 */
router.get('/personas/:id', personasCtrl.getById);

/**
 * @swagger
 * /api/personas:
 *   post:
 *     summary: Crea una nueva persona
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Apellido
 *               - Edad
 *               - Correo
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Edad:
 *                 type: integer
 *               Correo:
 *                 type: string
 *               VendedorId:
 *                 type: integer
 *                 description: ID del vendedor a asignar (opcional)
 *     responses:
 *       201:
 *         description: Persona creada exitosamente
 */
router.post('/personas', personasCtrl.create);

/**
 * @swagger
 * /api/personas/{id}:
 *   put:
 *     summary: Actualiza una persona existente
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El Id de la persona a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Apellido
 *               - Edad
 *               - Correo
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellido:
 *                 type: string
 *               Edad:
 *                 type: integer
 *               Correo:
 *                 type: string
 *               VendedorId:
 *                 type: integer
 *                 description: ID del nuevo vendedor a asignar (opcional, null para desasignar)
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *       404:
 *         description: Persona no encontrada
 */
router.put('/personas/:id', personasCtrl.update);

/**
 * @swagger
 * /api/personas/{id}:
 *   delete:
 *     summary: Elimina una persona por su Id
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El Id de la persona a eliminar
 *     responses:
 *       200:
 *         description: Persona eliminada correctamente
 *       404:
 *         description: Persona no encontrada
 */
router.delete('/personas/:id', personasCtrl.delete);

/**
 * @swagger
 * /api/persona/vendedores:
 *   get:
 *     summary: Obtiene la lista de todos los vendedores
 *     tags: [Vendedores]
 *     responses:
 *       200:
 *         description: Lista de todos los vendedores registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vendedor'
 */
router.get('/persona/vendedores', personasCtrl.getVendedores);

module.exports = router;
