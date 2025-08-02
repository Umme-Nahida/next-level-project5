import AppError from "../../ErrorHandler/appErrors";
import { IUser } from "./user.interface";
import { Users } from "./user.model";
import httpStatus from "http-status-codes"
import becryptjs from "bcryptjs"
import { envVars } from "../../confic/env";
import { Ride } from "../Ride/ride.model";



const addUser = async (payload: Partial<IUser>) => {

  const { email, password, ...rest } = payload;
  // console.log("addUserPayload",payload)

  const exceedUser = await Users.findOne({ email })

  if (exceedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exceed")
  }

  const hashedPassword = await becryptjs.hash(password as string, Number(envVars.becrypt_salt_round))

  const addUser = await Users.create({
    email,
    password: hashedPassword,
    ...rest
  })

  return addUser

}

const allUsers = async () => {

  const users = await Users.find().sort({ createdAt: -1 });

  return users

}

const allDrivers = async () => {

  const users = await Users.find({role:'DRIVER'}).sort({ createdAt: -1 });

  return users

}

const allRide = async () => {

  const users = await Ride.find().sort({ createdAt: -1 });

  return users

}


const blockUser = async (userId: string) => {
  const user = await Users.findByIdAndUpdate(
    userId,
    { isActive: "BLOCKED" },
    { new: true }
  );

  if (!user){
    throw new AppError(404,"User not found")
  }

  return user;

}

const unblockUser = async (userId: string) => {
  const user = await Users.findByIdAndUpdate(
    userId,
    { isActive: "ACTIVE" },
    { new: true }
  );

  if (!user){
    throw new AppError(404,"User not found")
  }

  return user;

}

export const userService = {
  addUser,
  allUsers,
  blockUser,
  unblockUser,
  allDrivers,
  allRide
}