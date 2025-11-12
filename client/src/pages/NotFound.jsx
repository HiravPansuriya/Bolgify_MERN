import React from "react";
import { Link } from "react-router-dom";
import "./All.css";

function NotFound() 
{
    return (
        <div className="flex flex-col items-center justify-center text-center  text-white px-4">

            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 animate-pulse drop-shadow-lg">
                404
            </h1>

            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-100">
                Page Not Found
            </h2>

            <p className="mt-2 text-gray-400 max-w-md">
                Oops! The page you're looking for doesn't exist or has been moved to another location.
            </p>

            <Link
                to="/"
                className="btn-primary btnG-primary mt-6"
            >
                Go Back Home
            </Link>

            {/* 
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-20 w-32 h-32 bg-red-600 opacity-30 rounded-full mix-blend-screen animate-bounce"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-600 opacity-30 rounded-full mix-blend-screen animate-ping"></div>
            </div> 
            */}
            
        </div>
    );
}

export default NotFound;
