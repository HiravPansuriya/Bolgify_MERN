import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";

import {
    getAllBlogs,
    searchBlogs,
    createBlog,
    getBlogById,
    addComment,
    updateBlog,
    deleteBlog,
    likeOrUnlikeBlog,
    getCommentById,
    updateComment,
    deleteComment,
    getBlogLikes,
} from "../controllers/blogController.js";

import {
    restrictToBlogOwnerOrAdmin,
    restrictToCommentOwnerOrAdmin,
    requireAuth,
} from "../middlewares/auth.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Blogify/Post",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.get("/", requireAuth, getAllBlogs);
router.get("/search", requireAuth, searchBlogs);
router.post("/", requireAuth, upload.single("coverImage"), createBlog);
router.get("/:id", requireAuth, getBlogById);
router.put("/:id", requireAuth, restrictToBlogOwnerOrAdmin("id"), upload.single("coverImage"), updateBlog);
router.delete("/:id", requireAuth, restrictToBlogOwnerOrAdmin("id"), deleteBlog);

router.post("/:id/like", requireAuth, likeOrUnlikeBlog);
router.get("/:id/likes", requireAuth, getBlogLikes);

router.get("/comment/:id", requireAuth, getCommentById);
router.post("/comment/:id", requireAuth, addComment);
router.put("/comment/:id", requireAuth, restrictToCommentOwnerOrAdmin("id"), updateComment);
router.delete("/comment/:id", requireAuth, restrictToCommentOwnerOrAdmin("id"), deleteComment);

export default router;
