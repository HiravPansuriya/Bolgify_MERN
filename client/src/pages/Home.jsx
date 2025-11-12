import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./All.css";

function Home({ user }) 
{
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const revealRefs = useRef([]);

    useEffect(() => {

        if(!user) 
        {
            setLoading(false);
            setBlogs([]);
            return;
        }

        const fetchBlogs = async () => {

            try 
            {
                const res = await api.get("/blog");
                setBlogs(res.data.blogs || []);
            } 
            catch(err) 
            {
                console.error("Error fetching blogs:", err.response?.data || err.message);
                setError("Failed to load blogs. Please try again later.");
            } 
            finally 
            {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [user]);

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if(entry.isIntersecting) 
                    {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        revealRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            observer.disconnect();
        };
    }, [user, loading]);

    const addToRefs = (el) => {
        if(el && !revealRefs.current.includes(el)) 
        {
            revealRefs.current.push(el);
        }
    };

    if(!user) 
    {
        return (
            <div className="home-wrapper">
                <div className="home-content">

                    {/* Hero Section */}
                    <section className="hero-section reveal" ref={addToRefs}>
                        <h1 className="home-heading slide-down">Welcome to Blogify</h1>
                        <p className="home-subtitle fade-up" style={{ animationDelay: "0.3s" }}>
                            Blogify is your secure and feature-rich blogging platform.
                            Create, share, and manage blogs effortlessly with a clean and modern experience.
                        </p>

                        <div className="home-links">
                            <Link
                                to="/signup"
                                className="home-btn pop-in"
                                style={{ animationDelay: "0.6s" }}
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="home-btn pop-in"
                                style={{ animationDelay: "0.8s" }}
                            >
                                Login
                            </Link>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="features-section reveal" ref={addToRefs}>
                        <h2 className="section-title">Powerful Features You’ll Love</h2>
                        <div className="features">
                            <div className="feature-card">
                                <h3>🔐 OTP & JWT Authentication</h3>
                                <p>
                                    Signup with secure email verification and enjoy seamless JWT-based
                                    login. Google OAuth support included for quick access.
                                </p>
                            </div>
                            <div className="feature-card">
                                <h3>✍️ Full Blog Control</h3>
                                <p>
                                    Create, edit, and delete blogs easily. Save favorites,
                                    and interact with a dynamic like & comment system.
                                </p>
                            </div>
                            <div className="feature-card">
                                <h3>🔔 Real-Time Notifications</h3>
                                <p>
                                    Stay updated instantly when someone likes or comments on your post —
                                    powered by Context API and live updates.
                                </p>
                            </div>
                            <div className="feature-card">
                                <h3>🛡️ Secure & Private</h3>
                                <p>
                                    All sensitive actions are protected by authentication middleware with
                                    httpOnly cookies and server-side validation.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="about-section reveal" ref={addToRefs}>
                        <h2 className="section-title">About Blogify</h2>
                        <p className="about-text">
                            Blogify is designed for creators, writers, and readers who want a simple yet powerful platform
                            to share their thoughts and ideas.
                        </p>
                        <p className="about-text">
                            Whether you're a hobby writer or a professional blogger, Blogify offers the tools you need to
                            grow your audience and engage with your community effectively.
                        </p>
                    </section>

                    {/* How It Works Section */}
                    <section className="how-it-works-section reveal" ref={addToRefs}>
                        <h2 className="section-title">How It Works</h2>
                        <div className="steps">
                            <div className="step-card">
                                <span className="step-number">1</span>
                                <h4>Sign Up</h4>
                                <p>Create an account using our secure OTP verification process.</p>
                            </div>
                            <div className="step-card">
                                <span className="step-number">2</span>
                                <h4>Create Blogs</h4>
                                <p>Write engaging blogs with images and share them instantly.</p>
                            </div>
                            <div className="step-card">
                                <span className="step-number">3</span>
                                <h4>Interact</h4>
                                <p>Like, comment, and connect with other users on the platform.</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="footer reveal" ref={addToRefs}>
                        <p>© {new Date().getFullYear()} Blogify. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        );
    }

    if(loading) 
    {
        return (
            <div className="loading-container">
                <p>Loading blogs...</p>
            </div>
        );
    }

    if(error) 
    {
        return (
            <div className="error-container">
                <p className="error-text">{error}</p>
            </div>
        );
    }

    if(blogs.length === 0) 
    {
        return (
            <div className="container text-center py-5">
                <p className="no-blogs">No blogs available. Start by creating one!</p>
                <Link to="/blog/add-new" className="btn btnC-primary mt-3">
                    Create Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row g-4">
                {blogs.map((blog) => (
                    <div
                        key={blog._id}
                        className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                        ref={addToRefs}
                    >
                        <div className="card w-100">
                            <img
                                src={blog.coverImageURL}
                                className="card-img-top"
                                alt={blog.title}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{blog.title}</h5>
                                <Link
                                    to={`/blog/${blog._id}`}
                                    className="btn btn-outline-primary w-100"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
