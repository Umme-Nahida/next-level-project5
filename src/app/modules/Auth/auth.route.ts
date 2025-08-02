

import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../users/user.interface";
import { checkAuth } from "../../utils/checkAuth";
import passport from "passport";


const route = Router()

route.post("/login", authController.credentialsLogin)
route.post("/refresh-token", authController.getRefreshToken)
route.post("/logout",authController.logout)
route.get("/reset-pass", checkAuth(...Object.values(Role)), authController.resetPassword)

route.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

route.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),authController.googleCallback)



export const authRoute = route;