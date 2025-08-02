import { NextFunction, Request, Response } from "express"
import { envVars } from "../confic/env"



type typeAsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>


export const catchAsync = (fn: typeAsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {

        if (envVars.node_env === "development") {
            console.log("catch-err", err)
            next(err)
        }

    })
}
