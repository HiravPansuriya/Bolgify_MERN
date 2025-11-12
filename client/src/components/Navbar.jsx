import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import { generateAvatar } from "../utils/generateAvatar";
import { useNotifications } from "../context/NotificationContext";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, setNotifications } = useNotifications();

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        if(searchTerm.trim()) 
        {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleLogout = async () => {
        try 
        {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/");
            toast.success("🎉 Logged out successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            api.post("/user/logout").catch(err => {
                console.error("Backend logout failed:", err.response?.data || err.message);
            });
        }
        catch(err) 
        {
            console.error("Logout failed:", err.response?.data || err.message);
            toast.error("❌ Logout failed! Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        setNotifications(prev => prev.filter(n => n._id !== id));
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-blue" data-bs-theme="dark">
            <div className="container-fluid d-flex align-items-center">
                {/* Logo */}
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                    <img
                        src="/images/logo.webp"
                        alt="Blogify Logo"
                        width="40"
                        height="40"
                        className="rounded-circle"
                        style={{ objectFit: "cover" }}
                    />
                    <span className="text-light fw-bold fs-5">Blogify</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav w-100 d-flex align-items-center pt-1">
                        {/* Home */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        {/* If user logged in */}
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/blog/add-new" ? "active" : ""
                                            }`}
                                        to="/blog/add-new"
                                    >
                                        Add Blog
                                    </Link>
                                </li>

                                {user.role === "ADMIN" && (
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""
                                                }`}
                                            to="/admin"
                                        >
                                            Admin Panel
                                        </Link>
                                    </li>
                                )}

                                {/* Search Bar */}
                                <form className="searchS d-flex" role="search" onSubmit={handleSearch}>
                                    <input
                                        className="form-control me-2"
                                        type="search"
                                        placeholder="Search blogs..."
                                        aria-label="Search"
                                        value={searchTerm || ""}
                                        onChange={(e) => setSearchTerm(e.target.value ?? "")}
                                        required
                                    />
                                    <button className="btn btn-outline-light" type="submit">
                                        Search
                                    </button>
                                </form>

                                {user && (
                                    <li className="nav-item dropdown ms-lg-auto position-relative">
                                        <a
                                            className="nav-link notification-bell position-relative"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-bell-fill fs-4"></i>
                                            {unreadCount > 0 && (
                                                <span
                                                    className="number translate-middle badge rounded-pill bg-danger"
                                                >
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end shadow notification-dropdown p-0"
                                            style={{ minWidth: "350px", maxHeight: "400px", overflowY: "auto" }}
                                        >
                                            {notifications.length === 0 ? (
                                                <li className="dropdown-item text-center">
                                                    No notifications
                                                </li>
                                            ) : (
                                                notifications.map((n) => (
                                                    <li
                                                        key={n._id}
                                                        className={`d-flex align-items-start gap-2 notification-item ${!n.isRead ? "unread" : ""}`}
                                                        onClick={() => handleMarkAsRead(n._id)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={n.fromUser?.profileImageURL || "/images/default.png"}
                                                                width="30"
                                                                height="30"
                                                                className="rounded-circle"
                                                                alt="user"
                                                            />
                                                            <div className="notification-content">
                                                                {n.type === "like" && (
                                                                    <span>
                                                                        <strong>{n.fromUser?.fullName}</strong> liked your blog{" "}
                                                                        <strong>{n.blog?.title}</strong>
                                                                    </span>
                                                                )}
                                                                {n.type === "comment" && (
                                                                    <span>
                                                                        <strong>{n.fromUser?.fullName}</strong> commented on{" "}
                                                                        <strong>{n.blog?.title}</strong>
                                                                    </span>
                                                                )}
                                                                <div className="text-muted small">
                                                                    {new Date(n.createdAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </li>
                                )}

                                {/* User Dropdown */}
                                <li className="nav-item dropdown ">
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            src={
                                                user.profileImageURL && user.profileImageURL !== "/images/default.png"
                                                    ? user.profileImageURL
                                                    : generateAvatar(user.fullName, 35)
                                            }
                                            width="35"
                                            height="35"
                                            className="rounded-circle border border-white"
                                            style={{ objectFit: "cover" }}
                                        />
                                        <span>{user.fullName}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to={`/user/profile/${user._id}`}>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item btn-logout"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* If user NOT logged in */}
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/signup" ? "active" : ""
                                            }`}
                                        to="/signup"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/login" ? "active" : ""
                                            }`}
                                        to="/login"
                                    >
                                        Log In
                                    </Link>
                                </li>

                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
