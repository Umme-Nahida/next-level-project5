
import { envVars } from "../confic/env"
import { IUser } from "../modules/users/user.interface"
import { generateToken } from "./jwt"

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user?._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVars.secret, envVars.expiresIn)

    const refreshToken = generateToken(jwtPayload, envVars.secret, envVars.expiresIn)


    return {
        accessToken,
        refreshToken
    }
}