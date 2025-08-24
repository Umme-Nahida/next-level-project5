import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { oTPService } from "./otp.service"

const sendOTP = catchAsync(async(req:Request,res:Response, next: NextFunction)=>{
      const {email , name} = req.body; 

      await oTPService.sendOTP(email, name)
      sendResponse(res,{
            success: true,
            statusCode: httpStatus.OK,
            message: "OTP is send successfully",
            data: null
        })
   
    
})

const verifyOTP = catchAsync(async(req:Request,res:Response, next: NextFunction)=>{
    const {email, otp } = req.body;

    await oTPService.verifyOTP(email, otp)
    
    sendResponse(res,{
            success: true,
            statusCode: httpStatus.OK,
            message: "you has been verified successfully",
            data: null
        })
   
    
})


export const oTPController= {
   sendOTP,
   verifyOTP
}
