import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { driverService } from "./driver.services";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { isActive } from "../users/user.interface";
import AppError from "../../ErrorHandler/appErrors";
import { Users } from "../users/user.model";


export const driverAcceptRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = req.user as JwtPayload;
    const rideId = req.params.id as string;

    const result = await driverService.driverAcceptRide(driver, rideId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "The Ride has been accepted",
        data: result
    })
});


/**
 * Driver: update ride status (pickup)
 */
export const driverPickupRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = req.user as JwtPayload
    const rideId = req.params.id;

    const result = await driverService.driverPickupRide(driver, rideId)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "The Ride has been picked up",
        data: result
    })
});


/**
 * Driver: mark ride in transit
 */
export const driverInTransitRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = req.user as JwtPayload;
    const rideId = req.params.id;

    const result = await driverService.driverTransitRide(driver, rideId)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "The Ride has been Transit",
        data: result
    })

});


/**
 * Driver: complete ride
 */
 const driverCompleteRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = req.user as JwtPayload;
    const rideId = req.params.id;

    const result = await driverService.driverCompleteRide(driver, rideId)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "The Ride has been completed",
        data: result
    })
});


export const driverEarningsHistory = catchAsync(async (req: Request, res: Response) => {
  const driverId = (req.user as JwtPayload).userId;

  const result = await driverService.driverEarningsHistory(driverId)
  

  sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Driver earnings history retrieved successfully",
        data: result
    })
});




 const driverSetAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = (req.user as JwtPayload).userId as string;
  const { isActive: newStatus } = req.body;

  // validate newStatus must be 'ACTIVE' or 'INACTIVE'
  if (!newStatus || ![isActive.ACTIVE, isActive.INACTIVE].includes(newStatus)) {
    return next(new AppError(400,"isActive must be 'ACTIVE' or 'INACTIVE'"));
  }

  const driver = await Users.findByIdAndUpdate(
    driverId,
    { isActive: newStatus },
    { new: true }
  );

   sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Driver availability updated",
        data: driver
    })
});



export const driverController = {
    driverAcceptRide,
    driverPickupRide,
    driverInTransitRide,
    driverCompleteRide,
    driverSetAvailability,
    driverEarningsHistory
}