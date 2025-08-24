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
        EMAIL_SENDER: {
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_PORT: string;
        SMTP_HOST: string;
        SMTP_FROM: string;
    },
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;

}


const loadEnvVars = (): IEnvVars => {
    const requiredEnvVar = ["DB_URL", "PORT", "node_env", "secret", "expiresIn", "becrypt_salt_round", "super_admin_email", "super_admin_pass", "refresh_expiresIn", "refresh_secret", "EXPRESS_SESSION_SECRET", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CALLBACK_URL",
         "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FROM",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_USERNAME",
        "REDIS_PASSWORD"
    ]

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
         EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
        REDIS_HOST: process.env.REDIS_HOST as string,
        REDIS_PORT: process.env.REDIS_PORT as string,
        REDIS_USERNAME: process.env.REDIS_USERNAME as string,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    }
}


export const envVars = loadEnvVars()