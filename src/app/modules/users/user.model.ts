
import mongoose from "mongoose";
import { IAuthProvider, isActive, Role } from "./user.interface";
const { Schema, model } = mongoose;


const authProviderScema = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true }
}, {
  _id: false,
  versionKey: false
})

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Role,
    default: Role.RIDER
  },
  // Driver-specific fields 
  isApproved: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isActive: { type: String, enum: Object.values(isActive), default: isActive.ACTIVE },
  vehicleInfo: {
    type: {
      vehicle_type: String,
      vehicle_number: String,
      license_number: String,
      seats_available: String,
      vehicle_model: String,
      vehicle_color: String,
      licenseExpireDate: Date
    },
    default: null
  },
  auth: {
    type: [authProviderScema]
  },
  // For blocking user (rider/driver)
  isBlocked: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Users = model("Users", userSchema);
