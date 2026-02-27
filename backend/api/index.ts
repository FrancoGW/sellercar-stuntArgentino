/**
 * Entrada serverless para Vercel. El build copia dist a api/_nest (no "dist" porque está en .gitignore y Vercel no lo sube).
 * Ruta raíz (/ o /api): responde "Backend funcionando" si todo está ok.
 */
const isProduction = process.env.NODE_ENV === 'production';
const appFactoryPath = isProduction ? './_nest/app.factory' : '../src/app.factory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppFactory } = require(appFactoryPath);

module.exports = AppFactory.create().expressApp;
