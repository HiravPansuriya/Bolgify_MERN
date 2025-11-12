import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import VerifyOTP from "./pages/VerifyOTP";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import AddBlog from "./pages/AddBlog";
import Blog from "./pages/Blog";
import EditBlog from "./pages/EditBlog";
import EditComment from "./pages/EditComment";
import NotFound from "./pages/NotFound";
import { NotificationProvider } from "./context/NotificationContext";
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() 
{
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if(storedUser) 
        {
            setUser(JSON.parse(storedUser));
        } 
        else 
        {
            setUser(null);
        }
        setLoadingUser(false);

    }, []);

    if(loadingUser) 
    {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <>
            <NotificationProvider>
                <Navbar user={user} setUser={setUser} />
                <ToastContainer />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/signup" element={<Signup setUser={setUser} />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/user/profile/:id" element={<Profile setUser={setUser} />} />
                        <Route path="/user/public/:username" element={<PublicProfile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/blog/add-new" element={<AddBlog />} />
                        <Route path="/blog/:id" element={<Blog user={user} />} />
                        <Route path="/blog/edit/:id" element={<EditBlog />} />
                        <Route path="/blog/comment/edit/:id" element={<EditComment />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </NotificationProvider>
        </>
    );
}

export default App;
