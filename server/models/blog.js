import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        default: null,
    },
    coverImagePublicId: { 
        type: String, 
        default: null, 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],

}, {timestamps: true} );

const Blog = mongoose.models.blog || mongoose.model("blog", blogSchema);

export default Blog;
