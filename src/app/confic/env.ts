import dotenv from "dotenv";
dotenv.config();

interface IEnvVars {
    DB_URL: string,
    PORT: string,
    node_env: string,
    secret: string,
    expiresIn: string,
    becrypt_salt_round: string,
    super_admin_email: string,
    super_admin_pass: string,
    refresh_secret: string,
    refresh_expiresIn: string,
    EXPRESS_SESSION_SECRET: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CALLBACK_URL: string,
}


const loadEnvVars = (): IEnvVars => {
    const requiredEnvVar = ["DB_URL", "PORT", "node_env", "secret", "expiresIn", "becrypt_salt_round", "super_admin_email", "super_admin_pass", "refresh_expiresIn", "refresh_secret", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CALLBACK_URL",]

    requiredEnvVar.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.port as string,
        DB_URL: process.env.DB_URL!,
        node_env: process.env.node_env as string,
        secret: process.env.secret as string,
        expiresIn: process.env.expiresIn as string,
        becrypt_salt_round: process.env.becrypt_salt_round as string,
        super_admin_email: process.env.super_admin_email as string,
        super_admin_pass: process.env.super_admin_pass as string,
        refresh_secret: process.env.refresh_secret as string,
        refresh_expiresIn: process.env.refresh_expiresIn as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    }
}


export const envVars = loadEnvVars()