/**
 * Entrada serverless para Vercel. El build copia dist a api/dist para que la función tenga el código.
 * Ruta raíz (/ o /api): responde "Backend funcionando" si todo está ok.
 */
const isProduction = process.env.NODE_ENV === 'production';
const appFactoryPath = isProduction ? './dist/app.factory' : '../src/app.factory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppFactory } = require(appFactoryPath);

module.exports = AppFactory.create().expressApp;
