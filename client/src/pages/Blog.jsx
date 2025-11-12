import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { generateAvatar } from "../utils/generateAvatar";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

function Blog({ user }) 
{
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);

    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);
    const [likesLoading, setLikesLoading] = useState(false);

    const [saveLoading, setSaveLoading] = useState(false);
    const [savedByUser, setSavedByUser] = useState(false);

    useEffect(() => {

        const fetchBlog = async () => {

            try 
            {
                const res = await api.get(`/blog/${id}`);
                const blogData = res.data.blog;

                const likedByUser = user && blogData.likes.some((uid) => uid.toString() === user._id.toString());

                let isSaved = false;
                if(user) 
                {
                    const savedRes = await api.get("/user/saved");
                    const savedBlogs = savedRes.data.savedBlogs || [];
                    isSaved = savedBlogs.some((b) => b._id === blogData._id);
                }

                setBlog({
                    ...blogData,
                    likedByUser: likedByUser,
                    likesCount: blogData.likes.length,
                });

                setSavedByUser(isSaved);
                setComments(res.data.comments || []);
            } 
            catch(err) 
            {
                console.error(err);
                toast.error("❌ Failed to load blog.", { position: "top-right", autoClose: 3000 });
            } 
            finally 
            {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, user]);

    const handleLike = async () => {

        if(!user) 
        {
            toast.error("❌ You must be logged in to like a blog.", { position: "top-right", autoClose: 3000 });
            return;
        }

        setLikeLoading(true);
        try 
        {
            const res = await api.post(`/blog/${id}/like`);

            setBlog((prev) => ({
                ...prev,
                likedByUser: res.data.liked,
                likesCount: res.data.likesCount,
            }));
        } 
        catch(err) 
        {
            console.error(err);
            toast.error("❌ Failed to like/unlike blog.", { position: "top-right", autoClose: 3000 });
        } 
        finally 
        {
            setLikeLoading(false);
        }
    };

    const handleViewLikes = async () => {

        setLikesLoading(true);
        try 
        {
            const res = await api.get(`/blog/${id}/likes`);
            setLikedUsers(res.data.likes);
            setShowLikesModal(true);
        } 
        catch(err) 
        {
            console.error(err);
            if (err.response?.status === 403) 
            {
                toast.error("❌ You are not authorized to view this list.", { position: "top-right", autoClose: 3000 });
            } 
            else 
            {
                toast.error("❌ Failed to fetch likes.", { position: "top-right", autoClose: 3000 });
            }
        } 
        finally 
        {
            setLikesLoading(false);
        }
    };

    const handleSave = async () => {

        if(!user) 
        {
            toast.error("❌ You must be logged in to save a blog.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        setSaveLoading(true);
        try 
        {
            const res = await api.post(`/user/save/${id}`);
            const message = res.data.message;

            if(message.includes("unsaved")) 
            {
                setSavedByUser(false);
                // toast.info("💾 Blog removed from saved list.", {
                //     position: "top-right",
                //     autoClose: 3000,
                // });
            } 
            else 
            {
                setSavedByUser(true);
                // toast.success("💾 Blog saved successfully!", {
                //     position: "top-right",
                //     autoClose: 3000,
                // });
            }
        } 
        catch(err) 
        {
            console.error(err);
            toast.error("❌ Failed to save blog.", {
                position: "top-right",
                autoClose: 3000,
            });
        } 
        finally 
        {
            setSaveLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {

        e.preventDefault();
        if (!commentContent.trim()) return;

        try 
        {
            const res = await api.post(`/blog/comment/${id}`, { content: commentContent });
            const newCommentFromServer = res.data.comment;

            const newComment = {
                ...newCommentFromServer,
                createdBy: {
                    _id: user._id,
                    fullName: user.fullName,
                    profileImageURL: user.profileImageURL || "/images/default.png",
                },
            };

            setComments((prev) => [...prev, newComment]);
            setCommentContent("");
            toast.success("🎉 Comment posted!", { position: "top-right", autoClose: 3000 });
        } 
        catch(err) 
        {
            console.error(err);
            toast.error("❌ Failed to post comment.", { position: "top-right", autoClose: 3000 });
        }
    };

    const handleDeleteBlog = async () => {

        toast.info(
            <div>
                <p>Are you sure you want to delete this blog?</p>
                <div className="mt-2">
                    <button
                        onClick={async () => {
                            try 
                            {
                                await api.delete(`/blog/${id}`);
                                toast.dismiss();
                                toast.success("🗑 Blog deleted successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                                navigate("/");
                            } 
                            catch(err) 
                            {
                                console.error(err);
                                toast.error("❌ Failed to delete blog.", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            }
                        }}
                        className="btn btn-sm btnD-dangerD me-2"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="btn btn-sm btnD-secondary"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    const handleDeleteComment = async (commentId) => {

        toast.info(
            <div>
                <p>Are you sure you want to delete this comment?</p>
                <div className="mt-2">
                    <button
                        onClick={async () => {
                            try 
                            {
                                await api.delete(`/blog/comment/${commentId}`);
                                setComments((prev) => prev.filter((c) => c._id !== commentId));
                                toast.dismiss();
                                toast.success("🗑 Comment deleted successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            } 
                            catch(err) 
                            {
                                console.error(err);
                                toast.error("❌ Failed to delete comment.", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            }
                        }}
                        className="btn btn-sm btnD-dangerD me-2"
                    >
                        Yes
                    </button>
                    <button onClick={() => toast.dismiss()} className="btn btn-sm btnD-secondary">
                        No
                    </button>
                </div>
            </div >,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    if (loading) return <div className="blog-loading">Loading...</div>;
    if (!blog) return <div className="blog-error">Blog not found.</div>;

    return (
        <div className="blog-container container mt-5">
            {/* Blog Section */}
            <article className="Blog-card">
                <div className="blog-header">
                    <img
                        src={blog.createdBy?.profileImageURL && blog.createdBy?.profileImageURL !== "/images/default.png" ? blog.createdBy?.profileImageURL : generateAvatar(blog.createdBy?.fullName, 50)}
                        alt="Author"
                        className="author-img"
                    />
                    <div>
                        <h5 className="author-name">
                            <Link to={`/user/public/${blog.createdBy?.fullName}`} className="username-link">
                                {blog.createdBy?.fullName}
                            </Link>
                        </h5>
                        <small className="post-date">
                            Posted on {new Date(blog.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                            })}
                        </small>
                    </div>
                </div>

                <div className="blog-content">
                    <img src={blog.coverImageURL} alt="Cover" className="blog-cover" />

                    <div className="blog-meta">
                        <h1 className="blog-title">{blog.title}</h1>
                        <p className="blog-body">{blog.body}</p>

                        {user && blog.createdBy?._id === user._id && (
                            <div className="blog-actions">
                                <Link to={`/blog/edit/${blog._id}`} className="btn btnD-warning btn-sm">
                                    Edit
                                </Link>
                                <button onClick={handleDeleteBlog} className="btn btnD-dangerDD btn-sm">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {/* Like Section */}
            <div className="like-section">
                <button
                    className={`like-btn ${blog.likedByUser ? "liked" : ""}`}
                    onClick={handleLike}
                    disabled={likeLoading}
                >
                    <i className={blog.likedByUser ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    <span className="like-count">{blog.likesCount}</span>
                </button>
                Likes

                {user && blog.createdBy?._id === user._id && (
                    <button
                        onClick={handleViewLikes}
                        className="btn btnL-primary btn-sm ms-3"
                        disabled={likesLoading}
                    >
                        {likesLoading ? "Loading..." : "View Likes"}
                    </button>
                )}

                {/* Save button */}
                <button
                    className={`save-btn ${savedByUser ? "saved" : ""}`}
                    onClick={handleSave}
                    disabled={saveLoading}
                >
                    <i className={savedByUser ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                </button>
                <span className="ms-1">{savedByUser ? "Unsave" : "Save"}</span>
            </div>

            {/* Likes Modal */}
            {showLikesModal && (
                <div className="likes-modal-overlay">
                    <div className="likes-modal">
                        <a
                            onClick={() => setShowLikesModal(false)}
                            className="likes-modal-close"
                        >
                            ✕
                        </a>
                        <h2>Likes</h2>

                        {likedUsers.length === 0 ? (
                            <p className="likes-modal-empty">No likes yet.</p>
                        ) : (
                            <ul className="likes-modal-list">
                                {likedUsers.map((u) => (
                                    <li key={u._id} className="likes-modal-item">
                                        <img
                                            src={
                                                u.profileImageURL && u.profileImageURL !== "/images/default.png"
                                                    ? u.profileImageURL
                                                    : generateAvatar(u.fullName, 40)
                                            }
                                            alt={u.username}
                                        />
                                        <Link
                                            to={`/user/public/${u.fullName}`}
                                            onClick={() => setShowLikesModal(false)}
                                        >
                                            {u.fullName}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <section className="comments-section">
                <h3 className="comments-heading">Comments</h3>
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            className="form-control"
                            placeholder="Enter Comment"
                            rows={2}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btnC-primaryC mt-2">
                            Post Comment
                        </button>
                    </form>
                ) : (
                    <p className="login-message">Please log in to post a comment.</p>
                )}

                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((c) => (
                            <div className="comment-card" key={c._id}>
                                <div className="comment-header">
                                    <img
                                        src={c.createdBy?.profileImageURL && c.createdBy?.profileImageURL !== "/images/default.png" ? c.createdBy?.profileImageURL : generateAvatar(c.createdBy?.fullName, 35)}
                                        alt="User"
                                        className="comment-user-img"
                                    />
                                    <div>
                                        <h6 className="comment-author">
                                            <Link
                                                to={`/user/public/${c.createdBy?.fullName}`}
                                                className="username-link"
                                            >
                                                {c.createdBy?.fullName}
                                            </Link>
                                        </h6>
                                        <small className="comment-date">
                                            {new Date(c.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })}
                                        </small>
                                    </div>
                                </div>

                                <p className="comment-content">{c.content}</p>

                                {user && c.createdBy?._id === user._id && (
                                    <div className="comment-actions">
                                        <Link
                                            to={`/blog/comment/edit/${c._id}`}
                                            className="btn btnDD-warning btn-sm me-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btnD-dangerD btn-sm"
                                            onClick={() => handleDeleteComment(c._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-comments">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Blog;
