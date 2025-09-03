import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { any } from "zod";
import { IUser } from "./user.interface";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.addUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user created successfully",
        data: user
    })
})


const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.user;
    const user = await userService.updateProfile(req.body, decodedUser)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "user profile update successfully",
        data: user
    })
})

const allUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.allUsers(req.query as any)
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
    const query = req.query;

    const users = await userService.allRide(query as any)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All rides retrieve successfully",
        data: users
    })
})

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params)
    const userId = req.params.id;
    const action = req.params.action;

    const user = await userService.blockUser(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `${action} successfully`,
        data: user
    })
});


const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const action = req.params.action;

    const user = await userService.unblockUser(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `${action} successfully`,
        data: user
    })
});


const analyticsUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.analyticsUser()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user anatytics retrieve successfully",
        data: users
    })
})


const analyticsRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.analyticsRide()
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user anatytics retrieve successfully",
        data: users
    })
})



export const userController = {
    createUser,
    allUsers,
    blockUser,
    unblockUser,
    allDrivers,
    allRides,
    updateProfile,
    analyticsUser,
    analyticsRide
}