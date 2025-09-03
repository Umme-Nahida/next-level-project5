import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHandler/appErrors";
import { IRide } from "./ride.interface"
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes"
import { Users } from "../users/user.model";

const riderRequest = async (payload: Partial<IRide>, riderInfo: any) => {
    console.log("rider payload:", payload)
    const rider = riderInfo.userId;
    console.log("riderId:", rider)

    const existingRider = await Users.findOne({ role: "RIDER", _id:rider });
    const existingDriver = await Users.findOne({ role: "DRIVER", isApproved: true });
    // console.log("driver----------------", existingDriver)

    if (!existingRider) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Rider Found")
    }


    if (!existingDriver) {
        throw new AppError(httpStatus.BAD_REQUEST, "currently no drivers available")
    }
    const { pickupLocation, destinationLocation, paymentMethod, fare } = payload;

    const newRide = await Ride.create({
        rider,
        pickupLocation,
        destinationLocation,
        paymentMethod: paymentMethod,
        fare,
        requestedAt: new Date()
    });

    return newRide;

}


const estimate = async (body: any) => {
 const { pickupLocation , destinationLocation } = body
 console.log("estimate body:", body)

  // simple fake calculation (distance length * rate)
  const distance = Math.abs(pickupLocation.length - destinationLocation.length) + 5; 
  
  const estimatedFare = distance * 10; // per km $10
  console.log("distance",distance, estimatedFare)
   return { pickupLocation, destinationLocation, estimatedFare };
}


const getMyRides = async (rider: any, query: Record<string, any>) => {
  const {
    page = 1,
    limit = 5,
    sort = "-createdAt",
    searchTerm,
    minFare,
    maxFare,
    startDate,
    endDate,
    ...filters
  } = query;

  // ---- Filter ----
  const mongoFilter: any = { rider: rider.userId, ...filters };

  // fare range
  if (minFare || maxFare) {
    mongoFilter.fare = {
      ...(minFare ? { $gte: Number(minFare) } : {}),
      ...(maxFare ? { $lte: Number(maxFare) } : {}),
    };
  }
  
  // -------filter with data 
  if (startDate && endDate) {
   mongoFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
}


  // ---- Search ----
  if (searchTerm) {
    mongoFilter.$or = [
      { "pickupLocation.address": { $regex: searchTerm, $options: "i" } },
      { "destinationLocation.address": { $regex: searchTerm, $options: "i" } },
      { status: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // ---- Pagination ----
  const skip = (Number(page) - 1) * Number(limit);

  // ---- Query ----
  const rides = await Ride.find(mongoFilter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate([
      { path: "driver"},
      { path: "rider"},
    ]);

  // ---- Meta ----
  const total = await Ride.countDocuments(mongoFilter);
  const totalPage = Math.ceil(total / Number(limit));

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage,
    },
    rides,
  };
};



const cancelRide = async (rider: JwtPayload, rideId: string) => {
    const riderId = rider.userId as string

    const ride = await Ride.findOne({ _id: rideId, rider: riderId });
    console.log("ride", ride)
    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found")
    }



    if (ride.status !== 'requested') {
        throw new AppError(400, "Cannot cancel ride after it is accepted");
    }

    ride.status = 'cancelled';
    ride.timestampsHistory!.cancelledAt = new Date();
    await ride.save();

    return ride;

}

const rideDetails = async (id: string) => {
  
    const rideDetails = await Ride.findOne({_id:id}).populate(["rider","driver"]);

    if(!rideDetails){
       throw new AppError(httpStatus.NOT_FOUND, "Ride not found")
    }

    return rideDetails;
}


export const rideService = {
    riderRequest,
    getMyRides,
    cancelRide,
    estimate,
    rideDetails
}