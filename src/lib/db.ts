import mongoose from 'mongoose';

/** Solo se valida al conectar, no al importar (para permitir build sin .env). */
function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Definir MONGODB_URI en .env.local');
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') {
  global.mongoose = cached;
}

/**
 * Conexión a MongoDB con caché para evitar múltiples conexiones en desarrollo.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri()).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
