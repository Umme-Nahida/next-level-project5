import { Router } from "express";
import { userRoute } from "../modules/users/user.route";
import { authRoute } from "../modules/Auth/auth.route";


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
    
]


moduleRoutes.forEach((route)=>{
    routes.use(route.path, route.route)
})