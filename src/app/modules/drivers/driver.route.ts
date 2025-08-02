import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../users/user.interface";
import { driverController } from "./driver.controller";

const route = Router()

// only rider can access this route
route.patch('/approve/:id',checkAuth(Role.DRIVER), driverController.driverAcceptRide);
// route.get('/me',checkAuth(Role.DRIVER), rideController.getMyRides);
// route.patch('/:id',checkAuth(Role.DRIVER), rideController.riderCancelRide);


export const driverRoute = route;