import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { rideService } from "./ride.service"
import { JwtPayload } from "jsonwebtoken"

const riderRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const rider = req.user;
    const riderRequest = await rideService.riderRequest(req.body, rider as any)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "ride request created successfully",
        data: riderRequest
    })
})


const getMyRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rider = req.user;
    const query = req.query;
    const allRides = await rideService.getMyRides(rider,query)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "My rides Retrieved successfully",
        data: allRides
    })
})

/**
 * Rider: cancel ride before driver accepts
 */
export const riderCancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rider = req.user as JwtPayload
    const rideId = req.params.id as string;

    const result = await rideService.cancelRide(rider, rideId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "The Ride has been cancelled successfully",
        data: result
    })
});


export const estimate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const body = req.body;

    const result = await rideService.estimate(body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "The estimate fare retrieve successfully",
        data: result
    })
});


export const rideDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const {id} = req.params;

    const result = await rideService.rideDetails(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "The ride Details retrieve successfully",
        data: result
    })
});



export const rideController = {
    riderRequest,
    getMyRides,
    riderCancelRide,
    rideDetails,
    estimate
}