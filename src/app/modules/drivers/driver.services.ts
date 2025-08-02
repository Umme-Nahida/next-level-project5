import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../Ride/ride.model";
import AppError from "../../ErrorHandler/appErrors";

const driverAcceptRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string

    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(404, "Ride not found")
    }

    if (ride.status !== 'requested') {
        throw new AppError(400, "Ride already accepted or not available")
    }

    ride.status = 'accepted';
    ride.driver = driverId as any;
    ride.timestampsHistory!.acceptedAt = new Date();
    await ride.save();

    return ride;

}


const driverPickupRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string

   const ride = await Ride.findOne({ _id: rideId, driver: driverId });
   if(!ride) {
        throw new AppError(404, "Ride not found")
    }

  if (ride.status !== 'accepted') {
   throw new AppError(400,"Ride must be accepted first");
  }

  ride.status = 'picked_up';
  ride.timestampsHistory!.pickedUpAt = new Date();
  await ride.save();


    return ride;

}


const driverTransitRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string

    const ride = await Ride.findOne({ _id: rideId, driver: driverId });
    if (!ride) {
        throw new AppError(404,"Ride not found")
    };

    if (ride.status !== 'picked_up') {
        throw new AppError(400,"Ride must be picked up first")
    }

    ride.status = 'in_transit';
    ride.timestampsHistory!.inTransitAt = new Date();
    await ride.save();


    return ride;

}

const driverCompleteRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string

     const ride = await Ride.findOne({ _id: rideId, driver: driverId });


  if (!ride) {
        throw new AppError(404,"Ride not found")
    };

  if (ride.status !== 'in_transit') {
    throw new AppError(400,"Ride must be in transit first");
  }

  ride.status = 'completed';
  ride.timestampsHistory!.completedAt = new Date();

  // optional: calculate fare
  ride.fare = 500; // example

  await ride.save();

    return ride;

}

export const driverService = {
    driverAcceptRide,
    driverTransitRide,
    driverCompleteRide,
    driverPickupRide
}