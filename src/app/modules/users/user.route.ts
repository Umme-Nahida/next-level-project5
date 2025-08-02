import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "./user.interface";

const route = Router();



route.post('/register', userController.createUser);
// only admin can access this route
route.get('/all-users',checkAuth(Role.ADMIN), userController.allUsers);
route.get('/all-drivers',checkAuth(Role.ADMIN), userController.allDrivers);
route.get('/all-rides',checkAuth(Role.ADMIN), userController.allRides);
route.post('/users/block/:id',checkAuth(Role.ADMIN), userController.blockUser);
route.post('/users/unblock/:id',checkAuth(Role.ADMIN), userController.unblockUser);

export const userRoute = route;
