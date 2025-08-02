import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { driverService } from "./driver.services";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";


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
export const driverCompleteRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

export const driverController = {
    driverAcceptRide,
    driverInTransitRide
}