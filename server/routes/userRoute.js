import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";
import { restrictToSelf } from "../middlewares/auth.js";
import { checkForAuthenticationCookie, requireAuth, redirectIfAuthenticated } from "../middlewares/auth.js";

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
    deleteProfile
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
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", logout);

router.get("/me", checkForAuthenticationCookie("token"), getCurrentUser);

router.get("/public/:username", requireAuth, getPublicProfile);
router.get("/profile/:id", requireAuth, restrictToSelf("id"), getProfile);
router.put("/profile/:id", requireAuth, restrictToSelf("id"), upload.single("profileImage"), updateProfile);
router.delete("/profile/:id", requireAuth, restrictToSelf("id"), deleteProfile);

export default router;
