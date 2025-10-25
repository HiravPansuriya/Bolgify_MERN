import User from "../models/user.js";
import OTP from "../models/otp.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import { generateOTP, generateExpiry } from "../services/otpService.js";
import { sendOTPEmail } from "../services/mailer.js";
import crypto from "crypto";
import cloudinary from "../services/cloudinary.js";
import { createTokenForUser } from "../services/authentication.js";
import jwt from "jsonwebtoken";

export async function getCurrentUser(req, res) 
{
    if (!req.user) 
    {
        return res.status(401).json({ error: "Not authenticated" });
    }

    return res.json({ user: req.user });
}

export async function signup(req, res) 
{
    const { fullName, email, password } = req.body;

    try 
    {
        if (await User.findOne({ email })) 
        {
            return res.status(409).json({ error: "Email already exists" });
        }

        if (await User.findOne({ fullName })) 
        {
            return res.status(409).json({ error: "Username already taken" });
        }

        const otp = generateOTP();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        await OTP.deleteMany({ email });

        await OTP.create({
            email,
            fullName,
            hashedPassword:password,
            otpHash,
            expiresAt: generateExpiry(2),
        });

        await sendOTPEmail(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    } 
    catch (err) 
    {
        console.error(err);
        return res.status(500).json({ error: "Server error while signing up" });
    }
}

export async function verifyOtp(req, res) 
{
    const { email, otp } = req.body;

    try 
    {
        const record = await OTP.findOne({ email });
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        if (!record || record.otpHash !== otpHash) 
        {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (record.expiresAt < Date.now()) 
        {
            await OTP.deleteMany({ email });
            return res.status(400).json({ error: "OTP expired" });
        }

        const newUser = await User.create({
            fullName: record.fullName,
            email: record.email,
            password: record.hashedPassword,
            isEmailVerified: true,
        });

        const token = createTokenForUser(newUser);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        await OTP.deleteOne({ email });
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profileImageURL: newUser.profileImageURL,
                role: newUser.role,
            },
        });
    } 
    catch (err) 
    {
        console.error(err);
        return res.status(500).json({ error: "OTP verification failed" });
    }
}

export async function resendOtp(req, res) 
{
    const { email, fullName, password } = req.body;

    try 
    {
        if (!email || !fullName || !password) 
        {
            return res.status(400).json({ error: "Email, full name, and password are required." });
        }

        await OTP.deleteMany({ email });

        const otp = generateOTP();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        await OTP.create({
            email,
            fullName,
            hashedPassword: password,
            otpHash,
            expiresAt: generateExpiry(2),
        });

        await sendOTPEmail(email, otp);

        return res.status(200).json({ message: "OTP resent successfully!" });
    } 
    catch (err) 
    {
        console.error("Resend OTP Error:", err);
        return res.status(500).json({ error: "Failed to resend OTP" });
    }
}

export async function login(req, res) 
{
    const { email, password } = req.body;

    try 
    {
        const user = await User.findOne({ email });

        if (!user) 
        {
            return res.status(401).json({ error: "User not found" });
        }

        if (!user.isEmailVerified) 
        {
            return res.status(401).json({ error: "Email not verified" });
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);

        res.cookie("token", token, {
            httpOnly: true,      // Secure against XSS
            secure: false,
            sameSite: "Strict",  // Prevent CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageURL: user.profileImageURL,
                role: user.role,
            },
        });
    } 
    catch (err) 
    {
        return res.status(401).json({ error: "Invalid credentials" });
    }
}

export async function googleLogin(req, res) 
{
    try 
    {
        const { name, email } = req.body;

        if (!email) 
        {
            return res.status(400).json({ error: "Email is required" });
        }

        let user = await User.findOne({ email });

        if (!user) 
        {
            user = await User.create({
                fullName: name,
                email,
                isEmailVerified: true,
                profileImageURL: "/images/default.png",
                password: crypto.randomBytes(16).toString("hex"), // random password
                authProvider: "google",
            });
        }

        const token = createTokenForUser(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageURL: user.profileImageURL,
                role: user.role,
            },
        });
    } 
    catch (err) 
    {
        console.error("Google Login Error:", err);
        return res.status(500).json({ error: "Google login failed" });
    }
}

export function logout(req, res) 
{
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
}

export async function getPublicProfile(req, res) 
{
    try 
    {
        const user = await User.findOne({ fullName: req.params.username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const blogs = await Blog.find({ createdBy: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({ user, blogs });
    } 
    catch (err) 
    {
        return res.status(500).json({ error: "Error fetching public profile" });
    }
}

export async function getProfile(req, res) 
{
    try 
    {
        const user = await User.findById(req.params.id)
            .populate({
                path: "savedBlogs",
                populate: { path: "createdBy", select: "fullName profileImageURL" },
            });
        const blogs = await Blog.find({ createdBy: req.params.id });
        const comments = await Comment.find({ createdBy: req.params.id });
        const likedBlogs = await Blog.find({ likes: req.params.id }).populate("createdBy");

        return res.status(200).json({ user, blogs, comments, likedBlogs, savedBlogs: user.savedBlogs || [], });
    } 
    catch (err) 
    {
        return res.status(500).json({ error: "Error fetching profile" });
    }
}

export async function updateProfile(req, res) 
{
    try 
    {
        const { fullName="", password="", removeImage="" } = req.body || { };
        const user = await User.findById(req.params.id);
        
        if (removeImage === "true" && user.profileImageURL !== "/images/default.png") 
        {
            try 
            {
                await cloudinary.uploader.destroy(user.profileImagePublicId);
            }      
            catch(e) 
            {
                console.warn("Cloudinary destroy (removeImage) warning:", e?.message || e);
            }

            user.profileImageURL = "/images/default.png";
            user.profileImagePublicId = null;
        } 
        else if (req.file) 
        {
            if (user.profileImagePublicId && !user.profileImageURL.includes("default.png")) 
            {
                await cloudinary.uploader.destroy(user.profileImagePublicId);
            }

            user.profileImageURL = req.file.path;
            user.profileImagePublicId = req.file.filename;
        }

        if (fullName && fullName !== user.fullName) 
        {
            const existing = await User.findOne({ fullName });
            if (existing && existing._id.toString() !== req.params.id) 
            {
                return res.status(409).json({ error: "Username already taken" });
            }
            user.fullName = fullName;
        }

        if (password && password.trim().length >= 6) 
        {
            user.password = password;
            user.markModified("password");
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated"});
    } 
    catch (err) 
    {
        console.error(err);
        return res.status(500).json({ error: "Profile update failed" });
    }
}

export async function deleteProfile(req, res) 
{
    try 
    {
        const user = await User.findById(req.params.id);
        
        if (user.profileImagePublicId && !user.profileImageURL.includes("default.png")) 
        {
            try 
            {
                await cloudinary.uploader.destroy(user.profileImagePublicId);
            } 
            catch(err) 
            {
                console.warn("Cloudinary destroy (profile) warning:", err?.message || err);
            }
        }

        const blogs = await Blog.find({ createdBy: user._id });
        
        await Promise.all( blogs.map(async (blog) => {
            
            if(blog.coverImagePublicId) 
            {
                try 
                {
                    await cloudinary.uploader.destroy(blog.coverImagePublicId);
                } 
                catch(err) 
                {
                    console.warn("Cloudinary destroy (blog cover) warning:", err?.message || err);
                }
            }
        }));

        await Blog.deleteMany({ createdBy: req.params.id });
        await Comment.deleteMany({ createdBy: req.params.id });

        const blogIds = blogs.map(b => b._id);
        if(blogIds.length > 0) 
        {
            await Comment.deleteMany({ blogId: { $in: blogIds } });
        }

        await Blog.updateMany(
            { likes: user._id },
            { $pull: { likes: user._id } }
        );

        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("token");
        return res.status(200).json({ message: "User deleted" });
    } 
    catch (err) 
    {
        return res.status(500).json({ error: "Account deletion failed" });
    }
}

export async function toggleSaveBlog(req, res) 
{
    try 
    {
        const userId = req.user._id;
        const { blogId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const alreadySaved = user.savedBlogs.includes(blogId);

        if(alreadySaved) 
        {
            user.savedBlogs.pull(blogId);
            await user.save();
            return res.status(200).json({ message: "Blog unsaved successfully" });
        } 
        else 
        {
            user.savedBlogs.push(blogId);
            await user.save();
            return res.status(200).json({ message: "Blog saved successfully" });
        }
    } 
    catch(err) 
    {
        console.error("Save Blog Error:", err);
        return res.status(500).json({ error: "Failed to save blog" });
    }
}

export async function getSavedBlogs(req, res) 
{
    try 
    {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: "savedBlogs",
            populate: { path: "createdBy", select: "fullName profileImageURL" },
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ savedBlogs: user.savedBlogs });
    } 
    catch(err) 
    {
        console.error("Get Saved Blogs Error:", err);
        return res.status(500).json({ error: "Failed to fetch saved blogs" });
    }
}
