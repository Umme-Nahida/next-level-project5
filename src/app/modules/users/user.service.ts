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

// update your profile 
const updateProfile = async (payload: Partial<IUser>, decodedUser: any) => {

  const userId = decodedUser.userId
  const updateInfo = payload;
  console.log("updateUserPayload", payload, decodedUser)

  //   clg result: updateUserPayload { name: 'Umme Nahida' } {
  //   userId: '688cf31c5bd9bffaaeef3e70',
  //   email: 'niha@gmail.com',
  //   role: 'RIDER',
  //   iat: 1756568217,
  //   exp: 1756654617
  // }

  const addUser = await Users.findByIdAndUpdate(
    userId,
    updateInfo,
    { new: true }
  )

  return addUser

}


// -------get All user by admin
const allUsers = async (query: any) => {
  const { searchTerm, isApproved, isActive, role } = query;

  console.log("query", query)
  let filter: any = {};

  if (searchTerm) {
    filter.name = { $regex: searchTerm || "", $options: "i" }
  }

  if (isApproved) {
    filter.isApproved = isApproved === "true"
  }
  if (isActive) {
    filter.isActive = isActive
  }
  if (role) {
    filter.role = role
  }
  const users = await Users.find(filter).sort({ createdAt: -1 });

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

  console.log("qery", query)
  const queryBuilder = new QueryModel(Ride.find(), query)
  const rideResult = await queryBuilder
    .search(searchField)
    .filter()
    .sort()
    .pagination()
    .populate(["rider", "driver"])
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
    { isActive: "BLOCKED", isApproved: false, isBlocked: true },
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
    { isActive: "ACTIVE", isApproved: true, isVerified: true, isBlocked: false },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, "User not found")
  }

  return user;

}



const analyticsUser = async () => {

  const totalUsers = await Users.countDocuments();
  const totalRiders = await Users.countDocuments({ role: 'RIDER' });
  const totalDrivers = await Users.countDocuments({ role: 'DRIVER' });
  const totalAdmins = await Users.countDocuments({ role: 'ADMIN' });

  return {
    totalUsers,
    totalAdmins, totalDrivers, totalRiders
  }

}

// analytics all rides 
const analyticsRide = async () => {

  const totalRides = await Ride.countDocuments();
  const completedRides = await Ride.countDocuments({ status: 'completed' });
  const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });
  const inProgressRides = await Ride.countDocuments({ status: 'picked_up' });
  const requestedRides = await Ride.countDocuments({ status: 'requested' });
  const acceptedRides = await Ride.countDocuments({ status: 'accepted' });

  // previos week in rides
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const ridesThisWeek = await Ride.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });

  // previos monthe in rides
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const ridesThisMonth = await Ride.countDocuments({
    createdAt: { $gte: oneMonthAgo }
  });

  return {
    totalRides,
    completedRides,
    cancelledRides,
    requestedRides,
    acceptedRides,
    inProgressRides,
    ridesThisMonth,
    ridesThisWeek
  }

}


export const userService = {
  addUser,
  updateProfile,
  allUsers,
  blockUser,
  unblockUser,
  allDrivers,
  allRide,
  analyticsUser,
  analyticsRide
}