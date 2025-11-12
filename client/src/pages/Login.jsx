import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode  } from "jwt-decode"; 
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

const Login = ({ setUser }) => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try 
        {
            const res = await api.post("/user/login", formData);

            if(res.data.token) 
            {
                localStorage.setItem("token", res.data.token);
            }

            if(res.data.user) 
            {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user);
            }

            toast.success("🎉 Logged in successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            navigate("/");
        } 
        catch(err) 
        {
            console.error("Login Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Login failed! Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } 
        finally 
        {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {

        try 
        {
            const decoded = jwtDecode(credentialResponse.credential); 
            const { name, email, picture } = decoded;

            const res = await api.post("/user/google-login", {
                name,
                email,
                picture,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);

            toast.success("🎉 Google Login Successful!", {
                position: "top-right",
                autoClose: 3000,
            });

            navigate("/");
        } 
        catch(err) 
        {
            console.error("Google Login Error:", err.response?.data || err.message);
            toast.error("Google Login failed! Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleGoogleError = () => {
        toast.error("❌ Google Login Failed!");
    };

    return (
        <div className="containerLogin mt-5">
            <form onSubmit={handleSubmit} className="login-form">
                <h3 className="login-heading">Login to Blogify</h3>

                {/* Email Field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                    <div className="form-text">We'll never share your email with anyone else.</div>
                </div>

                {/* Password Field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Divider */}
                <div className="divider my-3 text-center text-muted">
                    <span>OR</span>
                </div>

                {/* ✅ Google Login Button */}
                <div className="google-login-wrapper d-flex justify-content-center mt-3">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </div>
            </form>
        </div>
    );
};

export default Login;
