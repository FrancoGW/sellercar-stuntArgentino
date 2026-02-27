/**
 * Entrada para Vercel. Se empaqueta con `ncc` en el build para incluir todo el backend en un solo archivo.
 * No cambiar el require: ncc lo usa para hacer el bundle desde backend/dist.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AppFactory } = require('../backend/dist/app.factory');

module.exports = AppFactory.create().expressApp;
