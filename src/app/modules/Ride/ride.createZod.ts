import { z } from "zod";

export const rideSchema = z.object({
  rider: z.string().optional(),
  driver: z.string().optional(),

  pickupLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),

  destinationLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),

  status: z.enum([
    'requested',
    'accepted',
    'picked_up',
    'in_transit',
    'completed',
    'cancelled'
  ]).default("requested"),

  fare: z.number().optional(),

  timestampsHistory: z.object({
    requestedAt: z.date().optional(),
    acceptedAt: z.date().optional(),
    pickedUpAt: z.date().optional(),
    inTransitAt: z.date().optional(),
    completedAt: z.date().optional(),
    cancelledAt: z.date().optional(),
  }).optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
