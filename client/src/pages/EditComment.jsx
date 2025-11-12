import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

function EditComment() 
{
    const { id } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchComment = async () => {

            try 
            {
                const res = await api.get(`/blog/comment/${id}`);
                setContent(res.data.comment.content);
            } 
            catch(err) 
            {
                console.error("Error fetching comment:", err);
                toast.error("❌ Failed to fetch comment.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } 
            finally 
            {
                setLoading(false);
            }
        };
        fetchComment();
    }, [id]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try 
        {
            const res = await api.put(`/blog/comment/${id}`, { content });
            toast.success("🎉 Comment updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate(`/blog/${res.data.comment.blogId}`);
        } 
        catch(err) 
        {
            console.error("Update comment error:", err);
            toast.error("❌ Failed to update comment.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    if (loading) return <div className="edit-comment-loading">Loading...</div>;

    return (
        <div className="edit-comment-container container mt-5 mb-5">
            <h2 className="mb-4">Edit Comment</h2>

            <form className="edit-comment-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Your Comment</label>
                    <textarea
                        id="content"
                        className="form-control"
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-success">Update Comment</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditComment;
