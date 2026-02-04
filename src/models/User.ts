import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  passwordHash?: string;
  role: 'admin' | 'user';
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    passwordHash: String,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    image: String,
    emailVerified: Date,
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models?.User ?? mongoose.model<IUser>('User', UserSchema);
