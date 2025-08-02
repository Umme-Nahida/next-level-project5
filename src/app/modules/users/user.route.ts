import { Router } from "express";
import { userController } from "./user.controller";

const route = Router();



route.post('/register', userController.createUser);
// only admin can access this route
route.get('/users', userController.createUser);
route.post('/users/block/:id', userController.createUser);
route.post('/users/unblock/:id', userController.createUser);

export const userRoute = route;
