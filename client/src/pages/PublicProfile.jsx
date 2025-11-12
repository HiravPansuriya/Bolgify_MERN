import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateAvatar } from "../utils/generateAvatar";
import api from "../api/axiosConfig";
import "./All.css";

function PublicProfile() 
{
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try 
            {
                const res = await api.get(`/user/public/${username}`);
                setProfileUser(res.data.user);
                setBlogs(res.data.blogs || []);
            } 
            catch(err) 
            {
                console.error("Error fetching profile:", err);
                toast.error("❌ Failed to load profile.", { position: "top-right", autoClose: 3000 });
                setError("Failed to load profile.");
            } 
            finally 
            {
                setLoading(false);
            }
        };
        
        fetchProfile();

    }, [username]);

    if (loading) return <div className="public-profile-loading">Loading...</div>;
    if (error) return <div className="public-profile-error">{error}</div>;

    return (
        <div className="public-profile-container container mt-5">
            <div className="text-center">
                <img
                    src={
                        profileUser.profileImageURL && profileUser.profileImageURL !== "/images/default.png"
                            ? profileUser.profileImageURL
                            : generateAvatar(profileUser.fullName, 35)
                    }
                    alt="Profile"
                    className="rounded-circle profile-avatar"
                    width={100}
                    height={100}
                />
                <h3 className="mt-3">{profileUser.fullName}</h3>
            </div>

            <hr />

            <h4 className="mt-4">📝 Blogs by {profileUser.fullName}</h4>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div className="col" key={blog._id}>
                            <div className="card h-100 shadow-sm border-0">
                                {blog.coverImageURL && (
                                    <img
                                        src={blog.coverImageURL}
                                        alt="Blog Cover"
                                        className="card-img-top"
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                                        View Blog
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted mt-3">No blogs published yet.</p>
                )}
            </div>
        </div>
    );
}

export default PublicProfile;
