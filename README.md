# 📝 Blogify

**Blogify** is a secure, full-stack blogging platform built with the MERN stack — MongoDB, Express, React, and Node.js. It allows users to **sign up with email OTP verification**, securely authenticate with JWT, create and manage blog posts, like & comment on content, and view public or private profiles — all in a beautifully styled, dark-themed interface.

---

## 🚀 Features

### 🔐 Authentication

- Signup with **email OTP verification** (6-digit OTP sent via email)
- **Resend OTP** functionality with server-side validation
- Secure **JWT-based login** with token stored in cookies/localStorage
- Session management and **route protection** via middleware
- OTP expiry system (2 minutes) with timer on the frontend

### 👤 User System

- **Private profile** page (viewable only by the user)
- **Public profile** page (`/user/:username`) showing posts & info
- **Liked posts** section in private profile
- Profile update with optional **profile image upload** via Cloudinary
- Account deletion with cascading cleanup:
  - Blogs, comments, likes, and profile image removal

### ✍️ Blog System

- **CRUD operations** on posts (Create, Read, Update, Delete)
- **Like / Unlike** functionality (AJAX-powered, Instagram-style)
  - Animated heart icon
  - Like counter on cards and post pages
- **Commenting system**
  - Nested comments support
  - Real-time UI update after posting
- **Role-based permissions**
  - Only admin or post owner can edit/delete

### 🛡️ Security

- JWT authentication middleware
- Route restrictions for sensitive operations:
  - Password change
  - Account deletion
  - Blog/comment management
- Secure cookie storage (`httpOnly`, `SameSite=Strict`)
- Backend validations on all inputs

### 🎨 UI & Styling

- **Dark theme** throughout the app
  - Dark blue gradient backgrounds
  - Blue-accented buttons and cards
  - Clean, modern styling with custom CSS
- Responsive design for desktop and mobile
- Animated **OTP timer** and button enable/disable for resend
- Informative success/error **toast notifications**

---

## 🧑‍💻 Tech Stack

- **Frontend**: React.js, React Router, Axios, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Token), Email OTP via Nodemailer
- **File Upload**: Multer + Cloudinary
- **State Management**: Local React state
- **Styling**: Custom CSS (dark mode)
- **Environment Config**: `dotenv`

---

## 📂 Project Structure

```

BOLGIFY_MERN/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level components (Login, Signup, etc.)
│   │   └── App.js           # React Router setup
│   └── package.json         # Frontend dependencies
│
├── server/                  # Node.js backend
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── middlewares/         # Auth and error middleware
│   ├── controllers/         # Logic for routes
│   ├── services/            # Email, token, or helper logic
│   ├── uploads/             # Static files (images, etc.)
│   ├── .env                 # Environment variables
│   └── index.js             # Express entry point
│
├── .gitignore
├── README.md
└── package.json             # If using root-level scripts

```
