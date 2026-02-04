import mongoose, { Schema, Model } from 'mongoose';

export interface IAnalyticsEvent {
  _id: mongoose.Types.ObjectId;
  name: string;
  payload?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  path?: string;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    name: { type: String, required: true },
    payload: Schema.Types.Mixed,
    userId: String,
    sessionId: String,
    path: String,
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ name: 1, createdAt: -1 });
AnalyticsEventSchema.index({ sessionId: 1 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models?.AnalyticsEvent ??
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
