import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";
import { restrictToSelf, checkForAuthenticationCookie, requireAuth, redirectIfAuthenticated } from "../middlewares/auth.js";

import {
    getCurrentUser,
    signup,
    verifyOtp,
    resendOtp,
    login,
    googleLogin, 
    logout,
    getPublicProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    getSavedBlogs,
    toggleSaveBlog
} from "../controllers/userController.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Blogify/Profile",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.use(checkForAuthenticationCookie("token"));

router.post("/signup", redirectIfAuthenticated, signup);
router.post("/verify-otp", redirectIfAuthenticated, verifyOtp);
router.post("/resend-otp", redirectIfAuthenticated, resendOtp);
router.post("/login", redirectIfAuthenticated, login);
router.post("/google-login", redirectIfAuthenticated, googleLogin);
router.post("/logout", logout);

router.get("/me", checkForAuthenticationCookie("token"), getCurrentUser);

router.get("/public/:username", requireAuth, getPublicProfile);
router.get("/profile/:id", requireAuth, restrictToSelf("id"), getProfile);
router.put("/profile/:id", requireAuth, restrictToSelf("id"), upload.single("profileImage"), updateProfile);
router.delete("/profile/:id", requireAuth, restrictToSelf("id"), deleteProfile);

router.post("/save/:blogId", requireAuth, toggleSaveBlog);
router.get("/saved", requireAuth, getSavedBlogs);

export default router;
