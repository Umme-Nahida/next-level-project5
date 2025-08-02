import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../users/user.interface";
import { driverController } from "./driver.controller";

const route = Router()

// only rider can access this route
route.patch('/approve/:id',checkAuth(Role.DRIVER), driverController.driverAcceptRide);
route.patch('/:id/pickup',checkAuth(Role.DRIVER), driverController.driverPickupRide);
route.patch('/:id/in-transit',checkAuth(Role.DRIVER), driverController.driverInTransitRide);
route.patch('/:id/complete',checkAuth(Role.DRIVER), driverController.driverCompleteRide);
route.get('/earnings',checkAuth(Role.DRIVER), driverController.driverEarningsHistory);
route.get('/setAvaility',checkAuth(Role.DRIVER), driverController.driverSetAvailability);


export const driverRoute = route;