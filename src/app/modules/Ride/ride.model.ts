
import mongoose from "mongoose";
import { IMethod } from "./ride.interface";
const { Schema, model } = mongoose;

const rideSchema = new Schema({
  rider: { type: Schema.Types.ObjectId, ref: 'User' },
  driver: { type: Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  destinationLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  paymentMethod:{type:String, enum:IMethod},
  status: { 
    type: String, 
    enum: [
      'requested',    
      'accepted',    
      'picked_up',
      'in_transit',   
      'completed',
      'cancelled'     
    ],
    default: 'requested'
  },
  fare: { type: Number, default: 0 }, 
  timestampsHistory: {
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date }
  }
}, {
  timestamps: true
});

export const Ride = model("Ride", rideSchema);
