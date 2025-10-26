import {validateToken} from "../services/authentication.js";
import User from "../models/user.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

export async function requireAuth(req, res, next) 
{
    try 
    {
        const token = req.cookies.token; 
        if (!token) return res.status(401).json({ error: "Authentication required." });

        const decoded = validateToken(token);
        if (!decoded) return res.status(401).json({ error: "Invalid or expired token." });

        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).json({ error: "Authentication required." });

        req.user = user; 
        next();
    } 
    catch(err) 
    {
        console.error("Auth error:", err.message);
        return res.status(401).json({ error: "Authentication required." });
    }
}

export function checkForAuthenticationCookie(cookieName) 
{
    return async(req, res, next) => {

        const tokenCookie = req.cookies[cookieName];
        
        if( !tokenCookie ) 
        {
            return next();
        }
        
        try
        {
            const decoded = validateToken(tokenCookie);

            const user = await User.findById(decoded._id).lean();
            if (user) 
            {
                req.user = user;
            }
        }
        catch(error) 
        { 
            console.error("Token validation error:", error.message);
        }

        next();
    }
}   

export function restrictTo( roles) 
{
    return function(req, res, next) 
    {
        if(!req.user)
        {
            return res.status(401).json({ error: "Authentication required." });
        }

        if( !roles.includes(req.user.role) )
        {
            return res.status(403).json({ error: "Access denied: insufficient permissions." });
        }

        next();
    }
}

export function redirectIfAuthenticated(req, res, next) 
{
    if(req.user) 
    {
        return res.status(400).json({ error: "Already logged in." });
    }

    next();
}

export function restrictToSelf(paramName = 'id') 
{
    return function(req, res, next) 
    {
        if (!req.user) 
        {
            return res.status(401).json({ error: "Authentication required." });
        }

        const requestedUserId = req.params[paramName];
        const loggedInUserId = req.user._id.toString();

        if (requestedUserId !== loggedInUserId) 
        {
            return res.status(403).json({ error: "Access denied: not your resource." });
        }

        next();
    };
}

export function restrictToBlogOwnerOrAdmin(paramName = "id") 
{
    return async function (req, res, next) 
    {
        if (!req.user)
        {
            return res.status(401).json({ error: "Authentication required." });
        } 

        const blog = await Blog.findById(req.params[paramName]);
        if (!blog)
        {
            return res.status(404).json({ error: "Blog not found." });
        } 

        const isOwner = blog.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";

        if (!isOwner && !isAdmin) 
        {
            return res.status(403).json({ error: "Access denied: not blog owner or admin." });
        }

        next();
    };
}

export function restrictToCommentOwnerOrAdmin(paramName = "id") 
{
    return async function (req, res, next) 
    {
        if (!req.user)
        {
            return res.status(401).json({ error: "Authentication required." });
        } 

        const comment = await Comment.findById(req.params[paramName]);
        if (!comment)
        {
            return res.status(404).json({ error: "Comment not found." });
        } 

        const isOwner = comment.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";

        if (!isOwner && !isAdmin) 
        {
            return res.status(403).json({ error: "Access denied: not comment owner or admin." });
        }

        next();
    };
}
