import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.addUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user created successfully",
        data: user
    })
})

const allUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.allUsers()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "all users retrieved successfully",
        data: users
    })
})
const allDrivers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.allDrivers()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user created successfully",
        data: users
    })
})


const allRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.allRide()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user created successfully",
        data: users
    })
})

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await userService.blockUser(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user is blocked",
        data: user
    })
});


const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const user = await userService.unblockUser(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user is unblocked",
        data: user
    })
});





export const userController = {
    createUser,
    allUsers,
    blockUser,
    unblockUser,
    allDrivers,
    allRides
}