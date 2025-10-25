import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", required: true 
    },
    type: { 
        type: String, 
        enum: ["like", "comment"], 
        required: true 
    },
    blog: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "blog", 
        required: true 
    },
    comment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "comment" 
    },
    fromUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },

}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
