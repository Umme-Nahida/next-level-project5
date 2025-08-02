import { NextFunction, Request, Response } from "express"
import { ZodObject } from "zod"

export const validateCreateSchema = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        req.body = await zodSchema.parseAsync(req.body)
        // console.log("zod req",req.body)
        next()
    } catch (err) {
        next(err)
    }
}