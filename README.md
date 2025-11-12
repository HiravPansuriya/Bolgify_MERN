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

```

BLOGIFY_MERN/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Navbar, BlogCard, Modals, etc.
│   │   ├── context/             # Auth, Notification, etc.
│   │   ├── pages/               # Login, Signup, Profile, BlogPage, etc.
│   │   ├── utils/               # Helper functions (avatar generator, etc.)
|   |   ├── api/                 # Axios Config 
│   │   └── App.jsx              # Routes setup
│   └── package.json
│
├── server/                      # Express Backend
│   ├── controllers/             # Business logic (user, blog, comment, notify)
│   ├── middlewares/             # Auth & error middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # RESTful API routes
│   ├── services/                # Helper services (email, tokens)
│   ├── .env
│   └── index.js                 # Entry point
│
├── .gitignore
├── README.md
└── package.json

```
