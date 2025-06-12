# E-commerce Website Project

## 📚 Introduction

This is a fullstack e-commerce website developed as the final project for the Introduction to Software Engineering course at University of Information Technology.

- **Guiding teacher:** Do Van Tien

**Team members:**
- Dang Viet Hoang - 23520513
- Tran Hoang Hai - 23520422

## 🚀 Features

- User registration, login, JWT authentication
- Product and category management
- Shopping cart, order placement, order history
- Admin dashboard for managing products, users, and orders
- Discount codes, product reviews
- Responsive UI (Tailwind CSS)
- REST API with Node.js/Express & MongoDB

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/theRaven1312/ECWeb.git
cd ECWeb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following lines:

```
LAUNCH_DB = your_db_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
API_URL=/api/v1
VITE_API_URL = http://localhost:3000/api/v1
PORT = 3000
```

## 🚀 Run the project

### 1. Start the front-end

```bash
npm run dev
```

### 2. Start the back-end

```bash
npm start
```
