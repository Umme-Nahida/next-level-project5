import jwt,{JwtPayload, SignOptions } from "jsonwebtoken"
import { string } from "zod";


export const generateToken = (payload: JwtPayload, sicret: string, expiresIn: string)=>{
      const accessToken = jwt.sign(payload,sicret,{expiresIn:expiresIn} as SignOptions)
      return accessToken;
}

export const verifyToken =(token:string, sicret: string)=>{
const tokenVarify = jwt.verify(token as string, sicret)
return tokenVarify;
}
