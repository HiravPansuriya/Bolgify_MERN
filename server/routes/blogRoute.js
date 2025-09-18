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

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.get("/", getAllBlogs);
router.get("/search", searchBlogs);
router.post("/", upload.single("coverImage"), createBlog);
router.get("/:id", getBlogById);
router.put("/:id", restrictToBlogOwnerOrAdmin("id"), upload.single("coverImage"), updateBlog);
router.delete("/:id", restrictToBlogOwnerOrAdmin("id"), deleteBlog);
router.post("/:id/like", likeOrUnlikeBlog);

router.get("/comment/:id", getCommentById);
router.post("/comment/:id", addComment);
router.put("/comment/:id", restrictToCommentOwnerOrAdmin("id"), updateComment);
router.delete("/comment/:id", restrictToCommentOwnerOrAdmin("id"), deleteComment);

export default router;
