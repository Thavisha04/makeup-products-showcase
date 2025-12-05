# GlowUp Cosmetics – Full-Stack Makeup Store
- A full-stack cosmetics e-commerce application built with Next.js, React, Contentful, and JWT-based authentication.
This project includes admin & author product management, dynamic routing, category/product contexts, login system, and protected APIs.

## Features
### Frontend
- Built using Next.js, React, and React-Bootstrap
- Responsive UI for desktop + mobile
- Dynamic pages for:
  - Home
  - Products
  - Product Details
  - Products by Author
- Reusable Components:
  - Navigation Bar with login/logout
  - Product cards & product list
  - Footer, Header
  - Authentication form
  - Context providers for:
    - Products
    - Categories
    - Authentication

### Backend Features
- API routes located under /pages/api/
- Full authentication system:
  - User login with bcrypt password hashing
  - JWT token stored in HttpOnly cookies
  - /api/auth/login, /api/auth/logout, /api/auth/me
- Protected product APIs:
  - Only admins and product authors can edit/delete
  - Public users can view all products
- Contentful CMS Integration for loading product content

### Authentication System
- Admin - Add, edit, delete ANY product + dashboard access
- Author - Add, edit, delete ONLY their own products
- Visitor - View products only


- Stored users are located in lib/auth.js with hashed passwords:
  - admin@gmail.com
  - thavisha@gmail.com
  - lithasha@gmail.com


- Passwords were generated using password-gen/generate-password.js.


### Technologies Used
- Frontend
  - Next.js
  - React
  - React Bootstrap
  - Context API for state management

- Backend / APIs
  - Next.js API Routes
  - bcryptjs (password hashing)
  - jsonwebtoken (JWT auth)
  - HttpOnly cookies
  - Contentful SDK

### How to Run the Project
- Install Dependencies
    - 'npm install'

- Start Development Server
    - 'npm run dev'
    - 'http://localhost:3000' -> App will run at


