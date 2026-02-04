/**
 * Script para crear usuario admin inicial.
 * Ejecutar con: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-admin.ts
 * Requiere MONGODB_URI y ADMIN_EMAIL, ADMIN_PASSWORD en env.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    passwordHash: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models?.User ?? mongoose.model('User', UserSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !email || !password) {
    console.error('Definir MONGODB_URI, ADMIN_EMAIL y ADMIN_PASSWORD');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin ya existe:', email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, name: 'Admin', passwordHash, role: 'admin' });
  console.log('Admin creado:', email);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
