// models/Url.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// URL Document Interface
export interface IUrl extends Document {
  originalUrl: string;
  shortId: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt?: Date;
  userId?: mongoose.Types.ObjectId;  // Changed from string to ObjectId
}

// URL Schema
const UrlSchema = new Schema<IUrl>(
  {
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    expireAt: { type: Date, default: null },
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },  // Fixed syntax here
  },
  { timestamps: true }
);

// Create an index on expireAt to automatically delete expired URLs
UrlSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Visit Document Interface
export interface IVisit extends Document {
  urlId: mongoose.Types.ObjectId;
  referralId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timestamp: Date;
}

// Visit Schema
const VisitSchema = new Schema<IVisit>({
  urlId: { type: Schema.Types.ObjectId, ref: "Url", required: true },
  referralId: { type: Schema.Types.ObjectId, ref: "Referral" },
  ipAddress: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String,
  country: String,
  city: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

// Referral Document Interface
export interface IReferral extends Document {
  urlId: mongoose.Types.ObjectId;
  code: string;
  description?: string;
  createdAt: Date;
}

// Referral Schema
const ReferralSchema = new Schema<IReferral>(
  {
    urlId: { type: Schema.Types.ObjectId, ref: "Url", required: true },
    code: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

// Create models if they don't exist
export const Url =
  mongoose.models.Url || mongoose.model<IUrl>("Url", UrlSchema);
export const Visit =
  mongoose.models.Visit || mongoose.model<IVisit>("Visit", VisitSchema);
export const Referral =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
