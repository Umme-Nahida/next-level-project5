import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";

const createUser = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
    const user = await userService.addUser(req.body)

     sendResponse(res,{
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user created successfully",
            data: user
        })
})





export const userController = {
     createUser
}