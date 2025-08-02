import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHandler/appErrors";
import { IRide } from "./ride.interface"
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes"

const riderRequest = async (payload: Partial<IRide>, riderInfo: any) => {

    const rider = riderInfo.userId;
    // console.log("riderId:",rider)
    const { pickupLocation, destinationLocation } = payload;

    const newRide = await Ride.create({
        rider,
        pickupLocation,
        destinationLocation,
        // status: 'requested',
        requestedAt: new Date()
    });

    return newRide;

}


const getAllRides = async (riderInfo: any) => {
    console.log(riderInfo)
    const rider = riderInfo.userId;


    const newRide = await Ride.find({ rider: rider })

    return newRide;

}


const cancelRide = async (rider:JwtPayload, rideId:string) => {
    const riderId = rider.userId as string
    const ride = await Ride.findOne({ _id: rideId, rider: riderId });

    if (!ride) {
         throw new AppError(httpStatus.NOT_FOUND,"Ride not found")
    }

    if (ride.status !== 'requested') {
        throw new AppError(400,"Cannot cancel ride after it is accepted");
    }

    ride.status = 'cancelled';
    ride.timestampsHistory!.cancelledAt = new Date();
    await ride.save();

    return ride;

}




export const rideService = {
    riderRequest,
    getAllRides,
    cancelRide
}