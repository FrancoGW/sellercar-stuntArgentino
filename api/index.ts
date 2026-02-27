/**
 * Punto de entrada serverless en la raíz del monorepo (deploy único en Vercel).
 * Delega al backend compilado (backend/dist).
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AppFactory } = require('../backend/dist/app.factory');

module.exports = AppFactory.create().expressApp;
