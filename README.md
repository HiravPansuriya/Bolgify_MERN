# 📝 Blogify

**Blogify** is a secure, full-stack blogging platform built with the MERN stack — MongoDB, Express, React, and Node.js. It allows users to sign up with email OTP verification, securely authenticate with JWT, create and manage blog posts, like & comment on content, and view public or private profiles — all within a beautifully styled, dark-themed user interface.

---

## 🚀 Features

### 🔐 Authentication

- Signup with **email OTP verification**
- Secure **JWT-based login**
- Session management with `express-session`
- Token stored in `localStorage` or cookies
- Protected routes with backend middleware

### 👤 User System

- **Private profile** page (for logged-in users)
- **Public profile** page viewable by others (`/user/:username`)
- **Liked‑posts** section in the private profile (shows every post you’ve liked)

### ✍️ Blog System

- Create, edit, and delete posts
- Like / Unlike posts (AJAX, Instagram‑style heart icon)
  - One like per user per post
  - Like counter visible on every card & post page
- Commenting system (with optional nesting)
- Role-based permissions (user/admin)

### 🛡️ Security

- **JWT validation** middleware
- Route protection for sensitive actions:
  - Account deletion
  - Password change
  - Post/comment management
- Admin vs. user access restrictions

### 🎨 UI & Styling

- Fully responsive **dark theme**:
  - Dark blue gradient backgrounds
  - Blue-accented buttons and cards
  - Styled with custom CSS and React components
- Instagram‑like heart animation on like/unlike

---

## 🧑‍💻 Tech Stack

- **Frontend**: React.js, React Router, Axios, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Token), Email OTP (via Nodemailer)
- **File Upload**: Multer
- **State**: Local component state (optionally Redux)
- **Styling**: Custom CSS (Dark Mode)
- **Environment Config**: `dotenv` for config

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
