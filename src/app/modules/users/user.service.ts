import AppError from "../../ErrorHandler/appErrors";
import { IUser } from "./user.interface";
import { Users } from "./user.model";
import httpStatus from "http-status-codes"
import becryptjs from "bcryptjs"
import { envVars } from "../../confic/env";



const addUser = async(payload: Partial<IUser>)=>{

      const {email,password,...rest} = payload;
      // console.log("addUserPayload",payload)

      const exceedUser = await Users.findOne({email})

      if(exceedUser){
        throw new AppError(httpStatus.BAD_REQUEST, "User already exceed")
      }

      const hashedPassword = await becryptjs.hash(password as string,Number(envVars.becrypt_salt_round))

         const addUser = await Users.create({
             email,
             password: hashedPassword, 
             ...rest
         })
     
        return addUser

}

export const userService = {
    addUser
}