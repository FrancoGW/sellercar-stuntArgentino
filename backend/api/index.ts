/**
 * Entrada serverless para Vercel. Exporta la instancia Express de Nest.
 * En producción usa el build compilado (dist); en desarrollo usa src.
 */
const isProduction = process.env.NODE_ENV === 'production';
const appFactoryPath = isProduction ? '../dist/app.factory' : '../src/app.factory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppFactory } = require(appFactoryPath);

export default AppFactory.create().expressApp;
