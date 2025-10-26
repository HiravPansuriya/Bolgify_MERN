import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {

    try 
    {
        if(!req.user) 
        {
            return res.status(401).json({ error: "Authentication required." });
        }

        const notifications = await Notification.find({ user: req.user._id, isRead: false })
            .sort({ createdAt: -1 }) 
            .populate("fromUser", "fullName profileImageURL")
            .populate("blog", "title coverImageURL")
            .populate({ path: "comment", select: "content", strictPopulate: false });

        return res.status(200).json({ notifications });
    } 
    catch(error) 
    {
        console.error("Fetch notifications error:", error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

export const markNotificationRead = async (req, res) => {

    try 
    {
        if(!req.user) 
        {
            return res.status(401).json({ error: "Authentication required." });
        }
        
        const { id } = req.params;

        const notification = await Notification.findById(id);
        if (!notification) return res.status(404).json({ error: "Notification not found" });

        if(notification.user.toString() !== req.user._id.toString()) 
        {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Notification.findByIdAndDelete(id);

        return res.status(200).json({ message: "Notification marked as read", notification });
    } 
    catch(error) 
    {
        console.error("Mark notification read error:", error);
        return res.status(500).json({ error: "Failed to mark notification as read" });
    }
};
