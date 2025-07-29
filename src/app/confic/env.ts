import dotenv from "dotenv";
dotenv.config();

interface IEnvVars {
    DB_URL: string,
    PORT: string
}


const loadEnvVars = ():IEnvVars => {
    const requiredEnvVar = ["DB_URL", "PORT"]

    requiredEnvVar.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.port as string,
        DB_URL: process.env.DB_URL!,
    }
}


export const envVars = loadEnvVars()