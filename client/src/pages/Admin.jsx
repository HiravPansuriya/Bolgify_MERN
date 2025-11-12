import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { User, FileText, MessageCircle, Trash2, Eye } from "lucide-react";
import "./All.css";

function Admin() 
{
    const [data, setData] = useState({
        users: [],
        blogs: [],
        comments: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdminData = async () => {

        try 
        {
            setLoading(true);
            const res = await api.get("/admin");
            setData(res.data);
        } 
        catch(err) 
        {
            console.error("Error fetching admin dashboard:", err.response?.data || err.message);
            setError("Failed to load admin dashboard data.");
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const deleteBlog = async (blogId) => {

        toast.info(
            <div>
                <strong>Are you sure you want to delete this blog?</strong>
                <div className="mt-2">
                    <button
                        onClick={async () => {
                            try 
                            {
                                await api.delete(`/blog/${blogId}`);
                                setData((prev) => ({
                                    ...prev,
                                    blogs: prev.blogs.filter((b) => b._id !== blogId),
                                    comments: prev.comments.filter((c) => c.blogId?._id !== blogId),
                                }));
                                toast.dismiss();
                                toast.success("🗑️ Blog deleted successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            } 
                            catch(err) 
                            {
                                console.error(err);
                                toast.dismiss();
                                toast.error("❌ Failed to delete blog.", { autoClose: 3000 });
                            }
                        }}
                        className="btn btn-sm btnD-dangerD me-2"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="btn btn-sm btnD-secondary"
                    >
                        Cancel
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

    const deleteComment = async (commentId) => {

        toast.info(
            <div>
                <strong>Are you sure you want to delete this comment?</strong>
                <div className="mt-2">
                    <button
                        onClick={async () => {

                            try 
                            {
                                await api.delete(`/blog/comment/${commentId}`);
                                setData((prev) => ({
                                    ...prev,
                                    comments: prev.comments.filter((c) => c._id !== commentId),
                                }));
                                toast.dismiss();
                                toast.success("🗑️ Comment deleted successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            } 
                            catch(err) 
                            {
                                console.error(err);
                                toast.dismiss();
                                toast.error("❌ Failed to delete comment.", { autoClose: 3000 });
                            }
                        }}
                        className="btn btn-sm btnD-dangerD me-2"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="btn btn-sm btnD-secondary"
                    >
                        Cancel
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

    useEffect(() => {
        fetchAdminData();
    }, []);

    if(loading) 
    {
        return (
            <div className="admin-loading">
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    if(error) 
    {
        return (
            <div className="admin-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Dashboard</h2>

            {/* Users Section */}
            <section className="admin-section">
                <h4>
                    <User size={20} className="icon" /> Users ({data.users.length})
                </h4>
                <div className="card-list">
                    {data.users.map((u) => (
                        <div key={u._id} className="Card">
                            <p className="name">
                                <strong>{u.fullName}</strong>
                            </p>
                            <p className="email">
                                {u.email}
                            </p>
                            <span className={`role ${u.role.toLowerCase()}`}>{u.role}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Blogs Section */}
            <section className="admin-section">
                <h4>
                    <FileText size={20} className="icon" /> Blogs ({data.blogs.length})
                </h4>
                <div className="card-list">
                    {data.blogs.map((b) => (
                        <div key={b._id} className="Card blog-card">
                            <p>
                                <strong>{b.title}</strong> by <span>{b.createdBy?.fullName || "Unknown"}</span>
                            </p>
                            <div className="card-actions">
                                <Link to={`/blog/${b._id}`} className="btn btnA view-btn">
                                    <Eye size={16} /> View
                                </Link>
                                <button onClick={() => deleteBlog(b._id)} className="btn btnA delete-btn">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comments Section */}
            <section className="admin-section">
                <h4>
                    <MessageCircle size={20} className="icon" /> Comments ({data.comments.length})
                </h4>
                <div className="card-list">
                    {data.comments.map((c) => (
                        <div key={c._id} className="Card comment-Card">
                            <p>
                                <strong>{c.createdBy?.fullName || "Unknown"}</strong> on <span>{c.blogId?.title || "Untitled"}</span> :
                            </p>
                            <p className="comment-content">{c.content}</p>
                            <button onClick={() => deleteComment(c._id)} className="btn btnA delete-btn">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Admin;
