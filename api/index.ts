/**
 * Punto de entrada serverless en la raíz del monorepo (deploy único en Vercel).
 * El build copia backend/dist a api/dist para que la función tenga el módulo.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AppFactory } = require('./dist/app.factory');

module.exports = AppFactory.create().expressApp;
