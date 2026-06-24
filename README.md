# 🛍️ Sanctuary - MERN Stack E-Commerce Platform

Sanctuary is a full-stack e-commerce web application built using the
MERN stack. It provides a complete shopping experience with user
authentication, product management, cart functionality, online payments,
and an admin dashboard.

## 🚀 Live Demo

Frontend: https://sanctuary-frontend-nine.vercel.app/

Admin Panel: https://sanctuary-admin-drab.vercel.app/

Backend API: https://sanctuary-backend-lilac.vercel.app/

------------------------------------------------------------------------

## ✨ Features

### 👤 User Features

-   User registration and login
-   JWT-based authentication
-   Protected routes
-   Browse products
-   Product details
-   Add to cart
-   Update cart quantity
-   Remove cart items
-   Place orders
-   Payment integration
-   View order history

### 👨‍💼 Admin Features

-   Admin authentication
-   Add, update and delete products
-   Manage orders
-   Update order status
-   View order details

### 💳 Payment Integration

-   Razorpay integration
-   Stripe integration
-   Payment verification

### ☁️ Cloud Storage

-   Cloudinary image upload
-   Product image management

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React.js
-   React Router
-   Tailwind CSS
-   Axios

### Backend

-   Node.js
-   Express.js

### Database

-   MongoDB
-   Mongoose

### Authentication

-   JWT
-   bcrypt

### Services

-   Razorpay
-   Stripe
-   Cloudinary

### Deployment

-   Vercel

------------------------------------------------------------------------

## 📂 Project Structure

    Sanctuary
    │
    ├── frontend
    ├── backend
    └── admin

------------------------------------------------------------------------

## ⚙️ Installation

Clone the repository:

``` bash
git clone https://github.com/ShayalGeorgeK/Sanctuary.git
```

### Backend

``` bash
cd backend
npm install
```

Create `.env` file:

``` env
PORT = 

MONGODB_URI = 

CLOUDINARY_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_SECRET_KEY = 

JWT_SECRET = 

ADMIN_EMAIL = 
ADMIN_PASSWORD = 

STRIPE_SECRET_KEY = 

RAZORPAY_KEY_ID = 
RAZORPAY_KEY_SECRET = 

FRONTEND_URL = 
ADMIN_URL = 
```

Run:

``` bash
npm start
```

### Frontend

``` bash
cd frontend
npm install
```

Create `.env` file:

``` env 
VITE_BACKEND_URL = 

VITE_RAZORPAY_KEY_ID = 
```

Run:
``` bash
npm run dev
```

### Admin

``` bash
cd admin
npm install
```

Create `.env` file:

``` env 
VITE_BACKEND_URL = 
```

Run:
``` bash
npm run dev
```

------------------------------------------------------------------------

## 🔄 Application Flow

User → Authentication → Browse Products → Cart → Checkout → Payment →
Order Creation → Admin Management

------------------------------------------------------------------------

## 🔒 Security

-   JWT authentication
-   Protected API routes
-   Password hashing
-   Environment variable protection
-   Secure payment verification

------------------------------------------------------------------------

## 📚 Learning Outcomes

-   Full-stack MERN development
-   REST API development
-   Authentication and authorization
-   Database design
-   Payment gateway integration
-   Deployment

------------------------------------------------------------------------

## 🔮 Future Improvements

-   Product reviews and ratings
-   Wishlist feature
-   Search optimization
-   Email notifications
-   Order tracking
-   Performance improvements

------------------------------------------------------------------------

## 👨‍💻 Author

**Shayal K George**

GitHub: https://github.com/ShayalGeorgeK
