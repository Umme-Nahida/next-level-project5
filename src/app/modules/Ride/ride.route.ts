import { Router } from "express";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../users/user.interface";
import { validateCreateSchema } from "../../middlewares/validedRequest";
import { rideSchema } from "./ride.createZod";

const route = Router();


// only rider can access this route
route.post('/request',checkAuth(Role.RIDER), validateCreateSchema(rideSchema), rideController.riderRequest);
route.get('/me',checkAuth(Role.RIDER), rideController.getMyRides);
route.patch('/:id',checkAuth(Role.RIDER), rideController.riderCancelRide);
// route.post('/users/unblock/:id', userController.createUser);

export const rideRoute = route;
