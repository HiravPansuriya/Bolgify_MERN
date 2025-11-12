# 📝 Blogify

**Blogify** is a modern, secure, and feature-rich blogging platform built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
It offers seamless blogging, user interaction, and real-time engagement — all wrapped in a dark, elegant, and responsive interface.

---

## 🚀 Features

### 🔐 Authentication

- **Signup with Email OTP Verification**
  - 6-digit OTP sent securely via email
  - Resend OTP with server-side validation
  - OTP expires after 2 minutes with frontend timer
- **JWT-based Login**
  - Secure authentication using JWT stored in `httpOnly` cookies
  - Session management and protected routes using middleware
- **Google Authentication**
  - Auto-register new users or login existing ones
  - Generates default avatar for new Google users

### 👤 User System

- **Private Profile**
  - Manage your blogs, likes, saved posts, and personal info
- **Public Profile**
  - View other users’ blogs
- **Profile Management**
  - Update name, and profile image (via **Cloudinary**)
  - Auto-generated avatars for users without uploaded images
- **Account Deletion**
  - Cascading cleanup (blogs, comments, saved posts, and notifications)

### ✍️ Blog System

- **Full CRUD Operations**
  - Create, Read, Update, Delete
- **Save Blog**
  - Save blogs for later reading (bookmark feature)
  - Access saved blogs in your private profile
- **Like / Unlike System**
  - Real-time AJAX-like update without page reload
  - Animated heart icon and live like counter
- **Comment System**
  - Real-time comment addition and deletion
- **Role-Based Permissions**
  - Only blog owners or admins can edit/delete blogs

### 🔔 Notifications

- **Real-Time Notifications** using Context API
  - Get notified instantly when someone likes or comments on blog
  - Unread notifications shown in dropdown
  - Once read, they are **removed from both UI and database**

### 🛡️ Security

- **JWT-based Authentication & Authorization**
- **Protected Routes** for sensitive actions (like, comment, delete)
- **Sanitized Inputs & Backend Validation**
- **Secure Cookies** (`httpOnly`, `SameSite=Strict`)
- **Cascading Deletes** on user removal

### 🎨 UI & Styling

- **Dark Theme** with modern, gradient design
- **Responsive Layout** for desktop and mobile
- **Interactive Animations**
  - Like animation
  - OTP resend timer
- **Custom CSS Styling** with blue-accented tones
- **Toast Notifications** for instant feedback (success/error/info)

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, React Router, Axios, React Toastify |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Auth** | JWT, Email OTP (Nodemailer), Google OAuth |
| **File Storage** | Cloudinary + Multer |
| **State Management** | React Context API |
| **Styling** | Custom CSS (Dark Mode) |
| **Environment Config** | dotenv |

---

## 📂 Project Structure

```bash

BLOGIFY_MERN/
|
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Navbar, BlogCard, Modals, etc.
│   │   ├── context/             # Auth, Notification, etc.
│   │   ├── pages/               # Login, Signup, Profile, BlogPage, etc.
│   │   ├── utils/               # Helper functions (avatar generator, etc.)
|   |   ├── api/                 # Axios Config 
│   |   ├── .env.example
│   │   └── App.jsx              # Routes setup
│   ├── public/                  # Static assets
│   └── index.html
│
├── server/                      # Express Backend
│   ├── controllers/             # Business logic (user, blog, comment, notify)
│   ├── middlewares/             # Auth & error middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # RESTful API routes
│   ├── services/                # Helper services (email, tokens)
│   ├── .env.example
│   └── index.js                 # Entry point
│
├── db-backup/                   # MongoDB dump backup (optional)
└── README.md                    # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### 1. Clone Repository

```bash
git clone https://github.com/HiravPansuriya/Bolgify_MERN.git
cd Blogify_MERN
```

### 2. Backend Installation

```bash
cd server
npm install
```

### 3. Frontend Installation

```bash
cd client
npm install
```

### 4. Environment Variables Setup

#### Backend (.env file in server folder)

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/blogify_MERN

# Server Configuration
PORT=8000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env file in client folder)

Create a `.env` file in the `client` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 5. Database Setup

#### Option 1: Restore from Backup (Recommended)

If you have the database backup included in the project:

```bash
# Navigate to project root directory
cd Blogify_MERN

# Restore the database
mongorestore --db blogify_MERN ./db-backup/blogify_MERN
```

#### Option 2: Fresh Database Setup

If no backup is available, the application will create the necessary collections automatically when you first run it.

---

## 🏃 Running the Project

### Start Backend Server

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:8000`

### Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:3000`

### Access the Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/`

---
