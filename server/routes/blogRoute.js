import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.js";
import Blog from "../models/blog.js";

import {
    searchBlogs,
    createBlog,
    getBlogById,
    addComment,
    updateBlog,
    deleteBlog,
    likeOrUnlikeBlog,
    updateComment,
    deleteComment,
} from "../controllers/blogController.js";

import {
    restrictToBlogOwnerOrAdmin,
    restrictToCommentOwnerOrAdmin,
} from "../middlewares/auth.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Blogify/Post",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json({ blogs });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

router.get("/search", searchBlogs);
router.post("/", upload.single("coverImage"), createBlog);
router.get("/:id", getBlogById);
router.put("/:id", restrictToBlogOwnerOrAdmin("id"), upload.single("coverImage"), updateBlog);
router.delete("/:id", restrictToBlogOwnerOrAdmin("id"), deleteBlog);
router.post("/:id/like", likeOrUnlikeBlog);

router.post("/comment/:id", addComment);
router.put("/comment/:id", restrictToCommentOwnerOrAdmin("id"), updateComment);
router.delete("/comment/:id", restrictToCommentOwnerOrAdmin("id"), deleteComment);

export default router;
