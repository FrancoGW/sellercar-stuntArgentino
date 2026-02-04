import mongoose, { Schema, Model } from 'mongoose';

export interface IVehicle {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  images: string[];
  featured: boolean;
  published: boolean;
  /** Vencimientos: fechas para estados verde/amarillo/rojo */
  vtvExpiresAt?: Date;
  patentExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'ARS' },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: Number,
    fuel: String,
    transmission: String,
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    vtvExpiresAt: Date,
    patentExpiresAt: Date,
  },
  { timestamps: true }
);

VehicleSchema.index({ published: 1, createdAt: -1 });
VehicleSchema.index({ brand: 1, model: 1 });
VehicleSchema.index({ price: 1 });

export const Vehicle: Model<IVehicle> =
  mongoose.models?.Vehicle ?? mongoose.model<IVehicle>('Vehicle', VehicleSchema);
