import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

function EditBlog() 
{
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [currentCover, setCurrentCover] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchBlog = async () => {

            try 
            {
                const res = await api.get(`/blog/${id}`);
                setTitle(res.data.blog.title);
                setBody(res.data.blog.body);
                setCurrentCover(res.data.blog.coverImageURL);
            } 
            catch(err) 
            {
                console.error("Error fetching blog:", err);
                toast.error("❌ Failed to fetch blog.");
            } 
            finally 
            {
                setLoading(false);
            }
        };

        fetchBlog();

    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("body", body);
        if (coverImage) formData.append("coverImage", coverImage);

        try 
        {
            const res = await api.put(`/blog/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("🎉 Blog updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate(`/blog/${res.data.blog._id}`);
        } 
        catch(err) 
        {
            console.error("Update blog error:", err);
            toast.error("❌ Failed to update blog.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    if (loading) return <div className="edit-blog-loading">Loading...</div>;

    return (
        <div className="edit-blog-container container mt-5 mb-5">
            <h2 className="mb-4">Edit Blog</h2>

            <form className="edit-blog-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Blog Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="body" className="form-label">Content</label>
                    <textarea
                        name="body"
                        id="body"
                        className="form-control"
                        rows="4"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                </div>

                {currentCover && (
                    <div className="mb-3">
                        <label className="form-label">Current Cover Image</label><br />
                        <img
                            src={currentCover}
                            alt="Cover"
                            className="rounded shadow"
                            width={200}
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="coverImage" className="form-label">
                        Upload New Cover Image (optional)
                    </label>
                    <input
                        type="file"
                        name="coverImage"
                        id="coverImage"
                        className="form-controlI"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-success">Update Blog</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate(`/blog/${id}`)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditBlog;
