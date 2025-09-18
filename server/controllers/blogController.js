import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";
import cloudinary from "../services/cloudinary.js";

export async function getAllBlogs(req, res) {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 }) // newest first
            .populate("createdBy", "username email"); // include author details

        return res.status(200).json({ blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ error: "Failed to fetch blogs" });
    }
}

export const searchBlogs = async (req, res) => {
    try {
        const { query = "", page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({
            title: { $regex: query, $options: "i" } // case-insensitive search
        })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({
            title: { $regex: query, $options: "i" }
        });

        res.json({
            blogs,
            totalPages: Math.ceil(totalBlogs / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export async function createBlog(req, res) {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized: You must be logged in to create a blog." });
    }

    try {
        const { title, body } = req.body;
        let coverImageURL = null;
        let coverImagePublicId = null;

        if (req.file) {
            coverImageURL = req.file.path;
            coverImagePublicId = req.file.filename;
        }

        const newBlog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL,
            coverImagePublicId,
        });

        return res.status(201).json({ blog: newBlog });
    }
    catch (error) {
        console.error("Create Blog Error:", error);
        return res.status(500).json({ error: "Failed to create blog" });
    }
}

export async function getBlogById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid blog ID" });
        }

        const blog = await Blog.findById(id).populate("createdBy");
        const comments = await Comment.find({ blogId: id }).populate("createdBy");

        if (!blog) return res.status(404).json({ error: "Blog not found" });

        return res.status(200).json({ blog, comments });
    }
    catch (error) {
        console.error("Fetch Blog Error:", error);
        return res.status(500).json({ error: "Failed to fetch blog" });
    }
}

export async function updateBlog(req, res) {
    try {
        const { title, body } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ error: "Blog not found" });

        blog.title = title || blog.title;
        blog.body = body || blog.body;

        if (req.file) {
            if (blog.coverImagePublicId) {
                await cloudinary.uploader.destroy(blog.coverImagePublicId);
            }
            blog.coverImageURL = req.file.path;
            blog.coverImagePublicId = req.file.filename;
        }

        await blog.save();

        return res.status(200).json({ blog });
    }
    catch (error) {
        console.error("Update Blog Error:", error);
        return res.status(500).json({ error: "Failed to update blog" });
    }
}

export async function deleteBlog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        await cloudinary.uploader.destroy(blog.coverImagePublicId);
        await Blog.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ blogId: req.params.id });

        return res.status(200).json({ message: "Blog deleted" });
    }
    catch (error) {
        console.error("Delete Blog Error:", error);
        return res.status(500).json({ error: "Failed to delete blog" });
    }
}

export async function likeOrUnlikeBlog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);
        const userId = req.user._id;

        if (!blog) return res.status(404).json({ error: "Blog not found" });

        const liked = blog.likes.includes(userId);

        if (liked) {
            blog.likes.pull(userId);
        }
        else {
            blog.likes.push(userId);
        }

        await blog.save();

        return res.status(200).json({
            liked: !liked,
            likesCount: blog.likes.length,
        });
    }
    catch (error) {
        console.error("Like Blog Error:", error);
        return res.status(500).json({ error: "Failed to like/unlike blog" });
    }
}

export async function getCommentById(req, res) {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        // Find comment by ID and populate user
        const comment = await Comment.findById(id).populate("createdBy", "username email");

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        return res.status(200).json({ comment });
    } catch (error) {
        console.error("Get Comment Error:", error);
        return res.status(500).json({ error: "Failed to fetch comment" });
    }
}

export async function addComment(req, res) {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "Unauthorized: You must be logged in to comment." });
    }

    try {
        const { content, parentComment } = req.body;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        let parent = null;
        if (parentComment) {
            parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(400).json({ error: "Parent comment not found" });
            }
        }

        const newComment = await Comment.create({
            content,
            blogId,
            createdBy: req.user._id,
            parentComment: parent ? parent._id : null,
        });

        return res.status(201).json({ comment: newComment });
    }
    catch (error) {
        console.error("Add Comment Error:", error);
        return res.status(500).json({ error: "Failed to add comment" });
    }
}

export async function updateComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        comment.content = req.body.content;
        await comment.save();

        return res.status(200).json({ comment });
    }
    catch (error) {
        console.error("Update Comment Error:", error);
        return res.status(500).json({ error: "Failed to update comment" });
    }
}

export async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Comment deleted" });
    }
    catch (error) {
        console.error("Delete Comment Error:", error);
        return res.status(500).json({ error: "Failed to delete comment" });
    }
}
