import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
    },
    fullName: { 
        type: String, 
        required: true 
    },
    hashedPassword: { 
        type: String, 
        required: true 
    },
    otpHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("otp", otpSchema);

export default OTP;
