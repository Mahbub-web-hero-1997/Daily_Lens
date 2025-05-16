# [📰 The Daily Lens – Backend](https://daily-lens-server.vercel.app/)

**The Daily Lens** is a full-featured news application backend built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and includes a custom authentication system using **JWT** and **bcrypt**. It supports image uploads via **Cloudinary** with **Multer** handling file input. This backend powers the API and admin functionality for a MERN stack news publishing platform.

---

## 🚀 Features

- 🧑‍💻 **Admin Support**
  - Create, update, and delete news posts
- 👤 **User Management**
  - Register/login with a custom auth system
  - Role-based access control (`admin`, `user`)
- 🔐 **Authentication**
  - Secure password hashing with `bcrypt`
  - Token-based auth using `JWT`
  - Optional HTTP-only cookie storage
- 🖼️ **Image Upload**
  - Upload images using `Multer`
  - Store and serve images from **Cloudinary**
- 📦 **RESTful API**
  - Well-structured and organized routes and controllers

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt, cookie-parser
- **File Uploads:** Multer
- **Image Hosting:** Cloudinary
- **Environment Config:** dotenv

---

## 📁 Project Structure

📁 public
📁 src
- the-daily-lens-backend/
- ├── controllers/ # Route handlers
- ├── middleware/ # Auth & error middlewares
- ├── models/ # Mongoose schemas
- ├── routes/ # API route definitions
- ├── utils/ # Utility functions
- ├── temp/ # Temp image storage (optional)
- ├── .env
- ├── index.js
- └── app.js
