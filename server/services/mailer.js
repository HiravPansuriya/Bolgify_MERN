import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOTPEmail(email, otp) 
{
    try
    {
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Blogify Email OTP Verification',
        html: `
            <h2>Welcome to Blogify!</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 2 minutes.</p>
        `
        };

        return transporter.sendMail(mailOptions);
    }
    catch(error) 
    {
        console.error("Failed to send OTP email:", error);
        throw new Error("Could not send email. Try again.");
    }
}
