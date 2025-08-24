import crypto from "crypto"
import AppError from "../../ErrorHandler/appErrors";
import { Users } from "../users/user.model";
import { client } from "../../confic/redis.config";
import { sendEmail } from "../../utils/sendEmail";

const OPT_EXPIRATION = 2 * 60;

const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 1000000).toString();
    return otp;
}

// implement reset password
const sendOTP = async (email: string, name: string) => {
    const user = await Users.findOne({email})

    if(!user){
        throw new AppError(404, "user not found")
    }

    if(user.isVerified){
        throw new AppError(401, "you are already verified")
    }
    const otp = generateOTP();

    const redisKeys = `otp${email}`

    await client.set(redisKeys, otp, {
        expiration: {
            type: "EX",
            value: OPT_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP ",
        templateName: "OTP",
        templateData: {
            name: name,
            otp: otp
        }
    })
    return {}
}
const verifyOTP = async (email: string, otp: string) => {
    const redisKeys = `otp${email}`

    const savedOtp = await client.get(redisKeys);
   
    const user = await Users.findOne({email})

    if(!user){
        throw new AppError(404, "user not found")
    }

    if(user.isVerified){
        throw new AppError(401, "you are already verified")
    }

    if (!savedOtp) {
        throw new Error("OTP not found or expired")
    }
    if (savedOtp !== otp) {
        throw new Error("OTP not found or expired")
    }


    await Promise.all([
        await Users.updateOne({email}, { isVerified: true } , { new: true, runValidators: true }),
        client.del([redisKeys])
    ])

}

export const oTPService = {
    sendOTP,
    verifyOTP
}