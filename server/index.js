import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import blogRoutes from './routes/blogRoute.js';
import adminRoutes from './routes/adminRoute.js';
import { checkForAuthenticationCookie } from './middlewares/auth.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Allow only frontend origin
    credentials: true,               // Allow cookies and authentication headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Blogify backend is running...');
});

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: "Resource not found",
        message: `Cannot find ${req.originalUrl} on this server`,
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
