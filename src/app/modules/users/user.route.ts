import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "./user.interface";

const route = Router();



route.post('/register', userController.createUser);
route.patch('/updateProfile',checkAuth(...Object.values(Role)), userController.updateProfile);
// only admin can access this route
route.get('/all-users',checkAuth(Role.ADMIN), userController.allUsers);
route.get('/analyticsUser',checkAuth(Role.ADMIN), userController.analyticsUser);
route.get('/analyticsRide',checkAuth(Role.ADMIN), userController.analyticsRide);
route.get('/all-drivers',checkAuth(Role.ADMIN), userController.allDrivers);
route.get('/all-rides',checkAuth(Role.ADMIN), userController.allRides);
route.patch('/block/:id/:action',checkAuth(Role.ADMIN), userController.blockUser);
route.patch('/unblock/:id/:action',checkAuth(Role.ADMIN), userController.unblockUser);

export const userRoute = route;
