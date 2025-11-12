import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateAvatar } from "../utils/generateAvatar";
import api from "../api/axiosConfig";
import "./All.css";

function Profile({ setUser }) 
{
    const { id } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfileData = async () => {

            try 
            {
                const res = await api.get(`/user/profile/${id}`);
                const { user, blogs, likedBlogs, savedBlogs } = res.data;

                setProfileUser(user);
                setFullName(user.fullName);
                setBlogs(blogs || []);
                setLikedBlogs(likedBlogs || []);
                setSavedBlogs(savedBlogs || []);
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

        fetchProfileData();
    }, [id]);

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        const formData = new FormData();
        formData.append("fullName", fullName);
        if (password) formData.append("password", password);
        if (profileImage) formData.append("profileImage", profileImage);

        try 
        {
            await api.put(`/user/profile/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const response = await api.get(`/user/profile/${id}`);
            const updatedUser = response.data.user;

            setUser(updatedUser);
            setProfileUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("🎉 Profile updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } 
        catch(err) 
        {
            console.error("Update profile error:", err);
            toast.error("❌ Failed to update profile. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleRemoveImage = async () => {

        toast.info(
            <div>
                <strong>Remove Profile Image?</strong>
                <div className="mt-2">
                    <button
                        onClick={async () => {
                            try 
                            {
                                await api.put(`/user/profile/${id}`, { removeImage: "true" });

                                const response = await api.get(`/user/profile/${id}`);
                                const updatedUser = response.data.user;

                                setUser(updatedUser);
                                setProfileUser(updatedUser);
                                localStorage.setItem("user", JSON.stringify(updatedUser));

                                toast.dismiss();
                                toast.success("🖼️ Profile image removed successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                                window.location.reload();
                            } 
                            catch(err) 
                            {
                                console.error("Remove image error:", err);
                                toast.dismiss();
                                toast.error("❌ Failed to remove profile image.", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            }
                        }}
                        className="btn btn-sm btnD-dangerD me-2"
                    >
                        Yes, Remove
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

    const handleDeleteAccount = async () => {

        toast.warn(
            <div>
                <strong>⚠️ Delete Account?</strong>
                <p>This action cannot be undone.</p>
                <div className="mt-2">
                    <button
                        onClick={async () => {
                            try 
                            {
                                await api.delete(`/user/profile/${id}`);

                                setUser(null);
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");

                                toast.dismiss();
                                toast.success("🗑️ Account deleted successfully!", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });

                                navigate("/");
                            } 
                            catch(err) 
                            {
                                console.error("Delete account error:", err);
                                toast.dismiss();
                                toast.error("❌ Failed to delete account.", {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
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

    if(loading) 
    {
        return (
            <div className="profile-loading">
                <p>Loading profile...</p>
            </div>
        );
    }

    if(error) 
    {
        return (
            <div className="profile-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-container container mt-5 mb-5">
            <h2>User Profile</h2>

            <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="mb-3 d-flex flex-column">
                    <img
                        src={
                            profileUser.profileImageURL && profileUser.profileImageURL !== "/images/default.png"
                                ? profileUser.profileImageURL
                                : generateAvatar(profileUser.fullName, 35)
                        }
                        alt="Profile"
                        className="rounded-circle profile-avatar"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">New Password (leave blank to keep current)</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                        type="file"
                        className="form-controlI"
                        id="coverImage"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Update Profile
                </button>

                {profileUser.profileImageURL !== "/images/default.png" && (
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleRemoveImage}
                    >
                        Remove Profile Image
                    </button>
                )}
            </form>

            <hr />

            {/* User Blogs */}
            <h4 className="mt-5 mb-3">📝 Your Blogs</h4>
            {blogs.length === 0 ?
            (<p>You haven’t created any blogs yet.</p>) : (

                <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 g-4 mb-5">
                {blogs.map((blog) => (
                    <div className="col" key={blog._id}>
                        <div className="card h-100 shadow-sm border-0">
                            {blog.coverImageURL && (
                                <img
                                src={blog.coverImageURL}
                                className="card-img-top"
                                alt="Blog Cover"
                                style={{ height: "180px", objectFit: "cover" }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{blog.title}</h5>
                                <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                                    View Blog
                                </Link>
                            </div>
                            <div className="card-footer small">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}

            <hr className="my-4" />

            {/* Liked Blogs */}
            <h4 className="mt-5 mb-3">❤️ Liked Blogs</h4>
            {likedBlogs.length === 0 ? (
                <p>You haven’t liked any blogs yet.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 g-4 mb-5">
                    {likedBlogs.map((blog) => (
                        <div className="col" key={blog._id}>
                            <div className="card h-100 shadow-sm border-0">
                                {blog.coverImageURL && (
                                    <img
                                        src={blog.coverImageURL}
                                        className="card-img-top"
                                        alt="Blog Cover"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                                        View Blog
                                    </Link>
                                </div>
                                <div className="card-footer small">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <hr className="my-4" />

            {/* Saved Blogs */}
            <h4 className="mt-5 mb-3">📌 Saved Blogs</h4>
            {savedBlogs.length === 0 ? (
                <p>You haven’t saved any blogs yet.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5 g-4 mb-5">
                    {savedBlogs.map((blog) => (
                        <div className="col" key={blog._id}>
                            <div className="card h-100 shadow-sm border-0">
                                {blog.coverImageURL && (
                                    <img
                                        src={blog.coverImageURL}
                                        className="card-img-top"
                                        alt="Blog Cover"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <Link to={`/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                                        View Blog
                                    </Link>
                                </div>
                                <div className="card-footer small">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            <hr className="my-4" />

            {/* Delete Account */}
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
    );
}

export default Profile;
