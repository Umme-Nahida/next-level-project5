import { Router } from "express";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../users/user.interface";
import { validateCreateSchema } from "../../middlewares/validedRequest";
import { rideSchema } from "./ride.createZod";

const route = Router();


// only rider can access this route
route.post('/request',checkAuth(Role.RIDER), validateCreateSchema(rideSchema), rideController.riderRequest);
route.post('/estimate',checkAuth(Role.RIDER), rideController.estimate);
route.get('/myRides',checkAuth(Role.RIDER), rideController.getMyRides);
route.get('/rideDetails/:id',checkAuth(Role.RIDER), rideController.rideDetails);
route.patch('/:id',checkAuth(Role.RIDER), rideController.riderCancelRide);
// route.post('/users/unblock/:id', userController.createUser);

export const rideRoute = route;
