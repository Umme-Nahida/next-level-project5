import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../ErrorHandler/appErrors";
import { envVars } from "../confic/env";

export const checkAuth = (...restRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken = req.cookies.token || req.headers.authorization;
        console.log("accessToken",req.cookies.token)
        if (!accessToken) throw new AppError(403, "token isn't available");
        
        const tokenVarify = verifyToken(accessToken, envVars.secret) as JwtPayload
        console.log("tokenVarify", tokenVarify)
        console.log("restRoles", restRoles)

        if (!restRoles.includes(tokenVarify.role)) {
            throw new AppError(403, "you are not allowed to access this route")
        }
        req.user = tokenVarify;
        next()
    } catch (err) {
        next(err)
    }

}
