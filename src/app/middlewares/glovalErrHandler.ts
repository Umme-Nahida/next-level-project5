import { NextFunction, Request, Response } from "express"
import { envVars } from "../confic/env"
import AppError from "../ErrorHandler/appErrors"


export const globalErrHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.node_env === "development") {
        // console.log("global:--------", err)
    }

    let errorSources: any = [
        // {
        //     path:"isDeleted",
        //     message:"validation err isDeteled is boolean"
        // }
    ]

    let status = 500
    let message = `something went wrong ${err.message}`


    if (err.name === "ValidationError") {
        status=400
        const errors = Object.values(err.errors)

        errors.forEach((errObj: any) => errorSources.push({
            path: errObj.path,
            message: errObj.message
        }))
        // console.log("path:-------", errorSources)
    }

    //------------------------------------------ handle zod validation err
    else if (err.name === "ZodError") {
        status = 400
        message = "ZodError"

        err.issues.forEach((issue: any) => errorSources.push({
            path: issue.path[0],
            //  path:issue.path[issue.path.length - 1],
            message: issue.message
        }))
    }

    // -----------------------------------------------handle cast Error
  else if (err.name === "CastError") {
        status = 400,
            message = "Please provide valid id"
    }

  else if (err.code === 11000) {

        const dublicate = err.message.match(/"([^"]*)" /)
        status = 400,
            message = `${dublicate[1]} already exists`
    }

    else if (err instanceof AppError) {
        status = err.statusCode,
            message = err.message
    } else if (err instanceof Error) {
        status = 500,
            message = err.message
    }

    // console.log(errorSources)
    res.status(status).json({
        success: false,
        message: message,
        err: envVars.node_env === "development" ? err : null,
        errorSources,
        stack: envVars.node_env === "development" ? err.stack : null
    })
}