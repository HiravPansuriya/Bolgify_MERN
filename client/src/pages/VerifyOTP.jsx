import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./All.css";

function VerifyOTP() 
{
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(120);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const fullName = location.state?.fullName;
    const password = location.state?.password;

    useEffect(() => {

        if(!email) 
        {
            navigate("/signup");
        }
    }, [email, navigate]);

    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft((prev) => {
                
                if(prev <= 1) 
                {
                    clearInterval(timer);
                    setResendEnabled(true);
                    return 0;
                }
                if(prev === 91) 
                {
                    setResendEnabled(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {

        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return `${minutes}:${secs}`;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try 
        {
            const res = await api.post("/user/verify-otp", {
                email,
                otp,
            });

            toast.success("🎉 Account created successfully! Please log in.", {
                position: "top-right",
                autoClose: 3000,
            });

            if(res.data.token) 
            {
                localStorage.setItem("token", res.data.token);
                navigate("/login");
            }
        }
        catch(err) 
        {
            console.error("OTP Verification Error:", err.response?.data || err.message);
            setMessage({ type: "error", text: err.response?.data?.error || "Invalid OTP. Please try again." });
            toast.error(err.response?.data?.error || "❌ Invalid OTP. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        finally 
        {
            setLoading(false);
        }
    };

    const handleResend = async () => {

        if (!resendEnabled) return;

        try 
        {
            const res = await api.post("/user/resend-otp", { 
                email,
                fullName,
                password 
            });
            setMessage({ type: "success", text: res.data.message || "OTP Resent Successfully!" });
            toast.info(res.data.message || "📩 OTP Resent Successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            setTimeLeft(120);
            setResendEnabled(false);
        }
        catch(err) 
        {
            console.error("Resend OTP Error:", err.response?.data || err.message);
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to resend OTP." });
            toast.error(err.response?.data?.error || "❌ Failed to resend OTP.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (

        <div className="verify-container">
            <form onSubmit={handleSubmit} className="verify-form">
                <h4 className="verify-heading">
                    <span role="img" aria-label="lock">
                        🔐
                    </span>{" "}
                    Verify Your Email
                </h4>

                {/* Email Display */}
                <div className="mb-3">
                    <label className="msg">We've sent a 6-digit OTP to your email</label>
                    <input
                        type="text"
                        className="form-control-plaintext text-center"
                        value={email}
                        readOnly
                    />
                </div>

                {/* OTP Input */}
                <div className="otp-section mb-3">
                    <label htmlFor="otp" className="form-label">Enter OTP</label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="form-control text-center fw-semibold"
                        placeholder="Enter your OTP"
                        required
                    />
                    <div id="timer" className="timer-text">
                        {timeLeft > 0
                            ? `OTP will expire in ${formatTime(timeLeft)}`
                            : "OTP expired."}
                    </div>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div
                        className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Verify OTP Button */}
                <div className="d-grid mb-3">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </div>

                {/* Resend OTP Section */}
                <div className="resend-section">
                    Didn't receive it?{" "}
                    <button
                        type="button"
                        className={`resend-link ${!resendEnabled ? "resend-disabled" : ""}`}
                        onClick={handleResend}
                        disabled={!resendEnabled}
                    >
                        Resend
                    </button>
                </div>
            </form>
        </div>

    );
}

export default VerifyOTP;
