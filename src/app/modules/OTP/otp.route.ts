import {  Router } from "express";
import { oTPController } from "./otp.controller";
const route = Router()

route.post("/send", oTPController.sendOTP)
route.post("/verify", oTPController.verifyOTP)


export const oTPRoute = route;