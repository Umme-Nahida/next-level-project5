import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHandler/appErrors";
import { IRide } from "./ride.interface"
import { Ride } from "./ride.model";
import httpStatus from "http-status-codes"
import { Role } from "../users/user.interface";
import { Users } from "../users/user.model";

const riderRequest = async (payload: Partial<IRide>, riderInfo: any) => {
    console.log("rider payload:", payload)
    const rider = riderInfo.userId;
    console.log("riderId:",rider)
    const existingDriver = await Users.findOne({ role:"DRIVER", isApproved:true});
    console.log("driver----------------",existingDriver)

    if(!existingDriver){
        throw new AppError(httpStatus.BAD_REQUEST,"currently no drivers available")
    }
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


const getAllRides = async (riderInfo: any,query:any) => {
    console.log(riderInfo)
    const riderId = riderInfo.userId;
    const searchTerm = query.searchTerm
    

    const newRide = await Ride.find({ rider: riderId })

    return newRide;

}


const cancelRide = async (rider:JwtPayload, rideId:string) => {
    const riderId = rider.userId as string
    
    const ride = await Ride.findOne({ _id: rideId, rider: riderId });
    console.log("ride",ride)
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