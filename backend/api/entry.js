/**
 * Entrada para ncc: requiere el build de Nest y exporta la app Express.
 * El build ejecuta ncc y renombra el resultado a index.js para Vercel.
 */
const { AppFactory } = require('../dist/app.factory');
module.exports = AppFactory.create().expressApp;
