
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../utils/jwt";
import { isActive, IUser } from "../users/user.interface";
import { Users } from "../users/user.model";
import AppError from "../../ErrorHandler/appErrors";
import { envVars } from "../../confic/env";


const credentialsLogin = async(payload: Partial<IUser>)=>{
   const {email,password} = payload;

   const isUserExist = await Users.findOne({email})

   if(!isUserExist){
      throw new AppError(httpStatus.BAD_REQUEST,"email does not exist")
   }

   const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)
   
    if(!isPasswordMatch){
      throw new AppError(httpStatus.BAD_REQUEST,"password does not match")
   }

   const jwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role
   }

   const accessToken = generateToken(jwtPayload,envVars.secret,envVars.expiresIn)
   const refreshToken = generateToken(jwtPayload,envVars.refresh_secret,envVars.refresh_expiresIn)

   const {password:pass, ...rest} = isUserExist.toObject()

   return {
     accessToken,
     refreshToken,
     user: rest
   }

}


const getUser = async(req:any)=>{
  
    const userId = (req as any).user.userId;

    const user = await Users.findById(userId).select("-password");
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }


   return {
     user: user
   }

}



const getNewRefreshToken = async(refreshToken: string)=>{
   const verifyRefreshToken = verifyToken(refreshToken,envVars.refresh_secret) as JwtPayload

   const isUserExist = await Users.findOne({email:verifyRefreshToken.email})

   if(!isUserExist){
      throw new AppError(httpStatus.BAD_REQUEST,"user does not exist")
   }


   if(isUserExist.isActive === isActive.INACTIVE || isUserExist.isActive === isActive.BLOCKED){
      throw new AppError(httpStatus.BAD_REQUEST,`user is ${isUserExist.isActive}`)
   }

    if(isUserExist.isActive === isActive.BLOCKED as string){
       throw new AppError(httpStatus.BAD_REQUEST,`user is Deleted`)
    }

   
   const jwtPayload = {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role
   }

   const accessToken = generateToken(jwtPayload,envVars.secret,envVars.expiresIn)


   return {
     accessToken
   }

}

const resetPassword = async(getOldPass:string, getNewPass:string, decodedToken: JwtPayload)=>{
   
   const user = await Users.findById(decodedToken.userId)

   const passMatch = await bcryptjs.compare(getOldPass,user!.password as string)

   if(!passMatch){
      throw new AppError(httpStatus.BAD_REQUEST,"pass does not matched")
   }

   user!.password = await bcryptjs.hash(getNewPass, Number(envVars.becrypt_salt_round));
   user!.save();

   return true
}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await Users.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.becrypt_salt_round))

    user!.save();


}


export const authService = {
    credentialsLogin,
    getNewRefreshToken,
    resetPassword,
    changePassword,
    getUser
}