import { z } from "zod";
import { isActive, Role } from "./user.interface";

// // Role enum
// export const RoleEnum = z.enum(["ADMIN", "RIDER", "DRIVER"]);

// // isActive enum
// export const isActiveEnum = z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]);

// auth provider schema
export const authProviderSchema = z.object({
  provider: z.enum(["google", "credential"]),
  providerId: z.string().min(1, "providerId is required"),
});

// vehicle info schema (nullable)
export const vehicleInfoSchema = z.object({
  model: z.string().min(1, "Model is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  color: z.string().min(1, "Color is required"),
});

// User schema
export const userSchema = z.object({
  _id: z.string().optional(),

  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  role: z.enum(Object.keys(Role)).optional().default(Role.RIDER),

  isApproved: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  isActive: z.enum(Object.keys(isActive)).optional(),

  vehicleInfo: vehicleInfoSchema.nullable().optional(),

  auth: z.array(authProviderSchema),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
