import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

function AddBlog() 
{
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setLoading(true);

        try 
        {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", body);

            if(coverImage) 
            {
                formData.append("coverImage", coverImage);
            }

            const res = await api.post("/blog", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if(res.status === 201) 
            {
                toast.success("🎉 Blog added successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });

                navigate("/");
            }
        }
        catch(err) 
        {
            console.error("Error adding blog:", err.response?.data || err.message);

            toast.error(err.response?.data?.message || "❌ Failed to add blog. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });

            setError(err.response?.data?.message || "Failed to add blog. Please try again.");
        } 
        finally 
        {
            setLoading(false);
        }
    };

    return (
        <div className="add-blog-container">
            <div className="form-wrapper">
                <h2 className="page-title">Add New Blog</h2>

                {error && <p className="error-message">{error}</p>}

                <form className="add-blog-form" onSubmit={handleSubmit}>
                    {/* Blog Title */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>

                    {/* Blog Content */}
                    <div className="form-group">
                        <label htmlFor="body" className="form-label">
                            Content
                        </label>
                        <textarea
                            id="body"
                            className="form-control"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Add content here..."
                            required
                        ></textarea>
                    </div>

                    {/* Cover Image */}
                    <div className="form-group">
                        <label htmlFor="coverImage" className="form-label">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            className="form-controlI"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button type="submit" className="btnS-success" disabled={loading}>
                            {loading ? "Adding..." : "Add Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBlog;
