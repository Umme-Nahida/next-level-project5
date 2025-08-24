import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import passport from "passport";
import AppError from "../../ErrorHandler/appErrors";
import { createUserTokens } from "../../utils/userToken";
import { authService } from "./auth.services";
import { JwtPayload } from "jsonwebtoken";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync(async(req:Request,res:Response, next: NextFunction)=>{

    passport.authenticate("local",(err:any, user:any,info:any)=>{

       if(err){
        return next(new AppError(401, info?.message || err));
       }

       if (!user) {
          return next(new AppError(401, info?.message || "User does not exist"));
        }

       const userToken = createUserTokens(user)
    //    console.log("userToken",userToken)

         res.cookie("token",userToken.refreshToken,{
        httpOnly: true,
        secure: true,
        sameSite:"strict"
       })

    // remove password from user object
    delete user.toObject().password;

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:"user login successfully",
        data: {
            accessToken: userToken.accessToken,
            refreshToken: userToken.refreshToken,
            user: user
        }

    })

    }
        
)(req,res,next)

  
    // console.log(users)
})


const logout = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
        
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })

        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })
        sendResponse(res,{
            success: true,
            statusCode: httpStatus.CREATED,
            message: "user logout successfully",
            data: {}
        })
})


const getRefreshToken = catchAsync(async(req:Request,res:Response, next: NextFunction)=>{
    const token = req.cookies.token;
    if(!token){
        throw new AppError(httpStatus.BAD_REQUEST,"token is not found")
    }
    const loginInfoDecoded = await authService.getNewRefreshToken(token as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:"user login successfully",
        data: loginInfoDecoded

    })
    // console.log(users)
})


const resetPassword = catchAsync(async(req:Request,res:Response, next:NextFunction)=>{
        
       const decodeToken = req.user as JwtPayload;

       const getNewPass = req.body.newPass;
       const getOldPass = req.body.oldPass;

       await authService.resetPassword(getOldPass,getNewPass,decodeToken)

        sendResponse(res,{
            success: true,
            statusCode: httpStatus.OK,
            message: "password change successfully",
            data: null
        })
})


const googleCallback = catchAsync(async(req:Request,res:Response, next: NextFunction)=>{
    
    let state = req.query.state ? req.query.state  as string : "";
    console.log("state",state)

    if(state.startsWith("/")){
      state = state.slice(1)
    }

    const user = req.user;
    console.log("user",user)
    if(!user){
        throw new AppError(httpStatus.BAD_REQUEST,"user not found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)
    res.redirect(`http://localhost:5000/${state}`)
    
})




export const authController= {
    credentialsLogin,
    getRefreshToken,
    logout,
    resetPassword,
    googleCallback
}
