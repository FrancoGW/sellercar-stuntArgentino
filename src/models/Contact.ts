import mongoose, { Schema, Model } from 'mongoose';

export interface IContact {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message: string;
  vehicleId?: mongoose.Types.ObjectId;
  source: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    vehicleId: Schema.Types.ObjectId,
    source: { type: String, default: 'web' },
  },
  { timestamps: true }
);

export const Contact: Model<IContact> =
  mongoose.models?.Contact ?? mongoose.model<IContact>('Contact', ContactSchema);
