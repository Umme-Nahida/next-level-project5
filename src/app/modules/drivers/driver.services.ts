import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../Ride/ride.model";
import AppError from "../../ErrorHandler/appErrors";

const driverAcceptRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string
    console.log("accept rideId", rideId)
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


const driverPickupRide = async (driver: JwtPayload, rideId: string, status:string) => {
    const driverId = driver.userId as string

    const ride = await Ride.findOne({ _id: rideId, driver: driverId });
    console.log("rideId", rideId, "status", status)
    
    if (!ride) {
        throw new AppError(404, "Ride not found")
    }

    if (status == 'accepted' && ride.status !== 'requested') {
        // throw new AppError(400, "Ride must be accepted first");
         throw new AppError(400, "Ride already accepted or not available")
    }

    if (status == 'picked_up' && ride.status !== 'accepted') {
        throw new AppError(400, "Ride must be accepted first");
    }

    if (status == 'in_transit' && ride.status !== 'picked_up') {
        throw new AppError(400, "Ride must be pickup first before in transit");
    }

    if (status == 'completed' && ride.status !== 'in_transit') {
        throw new AppError(400, "Ride must be transit first before complete");
    }

    const result = await Ride.findByIdAndUpdate(rideId, {status: status}, {new: true})

    ride.timestampsHistory!.pickedUpAt = new Date();
    await ride.save();


    return result;

}


const driverTransitRide = async (driver: JwtPayload, rideId: string) => {
    const driverId = driver.userId as string

    const ride = await Ride.findOne({ _id: rideId, driver: driverId });
    if (!ride) {
        throw new AppError(404, "Ride not found")
    };

    if (ride.status !== 'picked_up') {
        throw new AppError(400, "Ride must be picked up first")
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
        throw new AppError(404, "Ride not found")
    };

    if (ride.status !== 'in_transit') {
        throw new AppError(400, "Ride must be in transit first");
    }

    ride.status = 'completed';
    ride.timestampsHistory!.completedAt = new Date();

    // optional: calculate fare
    ride.fare = 500; // example

    await ride.save();

    return ride;

}

const driverEarningsHistory = async (driverId: string) => {
    const completedRides = await Ride.find({ driver: driverId, status: 'completed' }).sort({ completedAt: -1 });

    const totalEarnings = completedRides.reduce((sum: any, ride: any) => sum + (ride.fare || 0), 0);

    return {
        totalEarnings
    }
}


const getMyRides = async (driver: any, query: Record<string, any>) => {
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
  const mongoFilter: any = { driver: driver.userId, status:"completed", ...filters };

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
      { path: "driver", select: "name email isActive vehicleInfo role _id createdAt"},
      { path: "rider", select: "name email isActive role _id createdAt"},
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


// manage active ride 
const manageActiveRide = async (driver: any) => {
    // console.log("driver Id", driver.userId)
    const activeRide = await Ride.find({driver: driver.userId, status: {$in:["accepted", "picked_up", "in_transit" ]}}).sort({createdAt: -1})
    .populate([
      { path: "rider", select: "name email isActive role _id"}, 
      { path: "driver", select: "name email isActive role _id vehicleInfo isApproved"}, 
           
    ])
    
    return activeRide;


  };

const incomingRequest = async () => {
    const allRidesRequested = await Ride.find({status: 'requested'}).sort({createdAt: -1}).populate("rider", "name email isActive role _id createdAt");

    return allRidesRequested;
}


export const driverService = {
    driverAcceptRide,
    driverTransitRide,
    driverCompleteRide,
    driverPickupRide,
    driverEarningsHistory,
    getMyRides,
    incomingRequest,
    manageActiveRide
}