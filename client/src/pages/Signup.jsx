import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

const Signup = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try 
        {
            const res = await api.post("user/signup", formData);
            toast.success("🎉 Signup successfully! Please verify your email.", {
                position: "top-right",
                autoClose: 3000,
            });
            console.log("Signup Success:", res.data);
            navigate("/verify-otp", {
                state: { 
                        email: formData.email,
                        fullName: formData.fullName,
                        password: formData.password,
                },
            });
            setFormData({ fullName: "", email: "", password: "" });
        }
        catch(err) 
        {
            console.error("Signup Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Signup failed! Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        finally 
        {
            setLoading(false);
        }
    };

    return (

        <div className="containerSignup mt-5">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="mb-4">Create Your Account</h2>

                {/* Full Name */}
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                    />
                    <div className="form-text">Username should be unique.</div>
                </div>

                {/* Email */}
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

                {/* Password */}
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
                        minLength="6"
                        required
                    />
                    <div className="form-text">Password must contain at least 6 characters.</div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>

    );
};

export default Signup;
