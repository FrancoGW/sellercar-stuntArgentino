/**
 * Punto de entrada serverless en la raíz del monorepo (deploy único en Vercel).
 * El build copia backend/dist a api/backend (no usamos "dist" porque está en .gitignore y Vercel no lo sube).
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AppFactory } = require('./backend/app.factory');

module.exports = AppFactory.create().expressApp;
