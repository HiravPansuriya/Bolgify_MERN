import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

export const getAdminDashboardData = async (req, res) => {
    try 
    {
        const users = await User.find({});
        const blogs = await Blog.find({}).populate("createdBy");
        const comments = await Comment.find({}).populate("createdBy").populate("blogId");

        return res.status(200).json({
            users,
            blogs,
            comments,
        });
    } 
    catch(err) 
    {
        console.error("Admin Dashboard Error:", err);
        return res.status(500).json({ error: "Failed to fetch admin dashboard data" });
    }
};
