import AppError from "../../ErrorHandler/appErrors";
import { IUser } from "./user.interface";
import { Users } from "./user.model";
import httpStatus from "http-status-codes"
import becryptjs from "bcryptjs"
import { envVars } from "../../confic/env";
import { Ride } from "../Ride/ride.model";
import { exitToruQuery, searchField } from "../../utils/constand";
import { QueryModel } from "../../utils/QueryBuilder";



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

  const users = await Users.find({ role: 'DRIVER' }).sort({ createdAt: -1 });

  return users

}

// old allride
// const allRide = async (query: Record<string,string>) => {

//   const searchTerm = query.searchTerm || "";
//   const status = query.status || null || "";
//   const sort = query.sort || "-createdAt";
//   const minFare = query.minFare ? Number(query.minFare) : 0;
//   const maxFare = query.maxFare ? Number(query.maxFare) : Infinity
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 5;
//   const skip = (page - 1) * limit;

//   // //--------------------------- this fil filtering will be used when you dont need to all property------------
//   // const select = query.select.split(",").join(" ") || "";

//   for (const field of exitToruQuery) {
//     delete query[field]
//   }



//   const allUsers = await Ride.find({
//     $or: [
//       { status: { $regex: status, $options: "i" } },
//       { fare: { $gte: minFare, $lte: maxFare } },
//       { "pickupLocation.address": { $regex: searchTerm, $options: "i" } },
//       { "destinationLocation.address": { $regex: searchTerm, $options: "i" } },
//     ]
//   }

//   ).find(query).sort(sort).skip(skip).limit(limit);

//   const totalDivision = await Users.countDocuments()
//   const totalPage = Math.ceil(totalDivision / limit);
//   return {
//     data: allUsers,
//     meta: {
//       page: page,
//       limit: limit,
//       totalPage: totalPage,
//       total: totalDivision
//     }
//   }

// }
const allRide = async (query: Record<string, string>) => {

  const queryBuilder = new QueryModel(Ride.find(), query)
  const rideResult = await queryBuilder
    .search(searchField)
    .filter()
    .sort()
    .pagination()
    .build()

  const metaData = await queryBuilder.getMeta()

  // const queryExecuted = await Promise.all([
  //     queryBuilder.build(),
  //     queryBuilder.getMeta()
  // ])

  // console.log(queryExecuted)
  return {
    data: rideResult,
    meta: metaData
  }

}


const blockUser = async (userId: string) => {
  const user = await Users.findByIdAndUpdate(
    userId,
    { isActive: "BLOCKED" },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user;

}

const unblockUser = async (userId: string) => {
  const user = await Users.findByIdAndUpdate(
    userId,
    { isActive: "ACTIVE" },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, "User not found")
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