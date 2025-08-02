import { Router } from "express";
import { userRoute } from "../modules/users/user.route";
import { authRoute } from "../modules/Auth/auth.route";
import { rideRoute } from "../modules/Ride/ride.route";
import { driverRoute } from "../modules/drivers/driver.route";


export const routes = Router();

const moduleRoutes = [
    {
        path:"/auth",
        route: authRoute
    },
    {
        path:"/user",
        route: userRoute
    },
    {
        path:"/rides",
        route: rideRoute
    },
    {
        path:"/drivers",
        route: driverRoute
    },
    
]


moduleRoutes.forEach((route)=>{
    routes.use(route.path, route.route)
})