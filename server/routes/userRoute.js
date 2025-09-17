import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";
import { restrictToSelf } from "../middlewares/auth.js";
import { checkForAuthenticationCookie } from "../middlewares/auth.js";

import {
    getCurrentUser,
    signup,
    verifyOtp,
    resendOtp,
    login,
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

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", checkForAuthenticationCookie("token"), getCurrentUser);

router.get("/public/:username", getPublicProfile);
router.get("/profile/:id", restrictToSelf("id"), getProfile);
router.put("/profile/:id", restrictToSelf("id"), upload.single("profileImage"), updateProfile);
router.delete("/profile/:id", restrictToSelf("id"), deleteProfile);

export default router;
