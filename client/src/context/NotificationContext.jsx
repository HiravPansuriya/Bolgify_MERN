import { createContext, useContext, useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead } from "../api/notificationApi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

    useEffect(() => {

        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const loadNotifications = async () => {

        if (!user) return;

        try
        {
            const { data } = await fetchNotifications();
            const unread = data.notifications.filter(n => !n.isRead);
            setNotifications(unread);
            setUnreadCount(unread.length);
        } 
        catch(err) 
        {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (id) => {

        try 
        {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.filter(n => n._id !== id)); // ✅ remove read ones
            setUnreadCount(prev => Math.max(prev - 1, 0));
        } 
        catch(err) 
        {
            console.error("Failed to mark notification read:", err);
        }
    };

    useEffect(() => {
        if (user) loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, markAsRead, loadNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
