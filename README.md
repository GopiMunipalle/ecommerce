# 🛍️ E-Commerce Backend (Node.js + Express + Sequelize + Razorpay)

This is the backend service for an e-commerce application built with **Node.js**, **Express**, **Sequelize ORM**, and **MySQL**.  
It handles user authentication, cart management, order creation, and Razorpay payment integration.

---

## 🚀 Features

- User & Admin roles (separate carts and orders)
- Cart-based and direct orders
- Secure JWT-based authentication
- Razorpay payment integration (test mode)
- Transaction-safe order and payment processing
- Cloudinary/S3 integration for product image uploads
- Sequelize ORM with MySQL

---

## 📦 Tech Stack

- **Backend Framework:** Express.js  
- **ORM:** Sequelize  
- **Database:** MySQL  
- **Payments:** Razorpay  
- **Authentication:** JWT  
- **Cloud Storage:** Cloudinary (optional)  
- **Environment Management:** dotenv

---

## ⚙️ Project Setup

### 1️⃣ Clone the repository


git clone (https://github.com/GopiMunipalle/ecommerce)
cd ecommerce-backend
2️⃣ Install dependencies
npm install

3️⃣ Create a .env file

Create a .env file in the root directory with the following content:

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_db_name
DB_USER=db_user
DB_PASS=db_pass

# JWT Configuration
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=7d

# Razorpay (Test Credentials)
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_test_secret

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App Configuration
PORT=8000


⚠️ Make sure your MySQL server is running and the database (DB_NAME) exists before starting the server.

🧩 Database Setup

Run Sequelize migrations or sync models automatically.

If your project uses auto-sync:

npm run dev


Or if using Sequelize CLI:

npx sequelize-cli db:migrate

▶️ Running the Server
Development
npm run dev

Production
npm start


Server will start on:

http://localhost:8000

💳 Razorpay Integration

Create an account on Razorpay Dashboard

Use your Test Key ID and Secret Key in .env

Webhook endpoint:

POST /api/payments/webhook


Ensure webhook secret matches your server configuration.

📁 Folder Structure
src/
 ├── config/
 │   └── dbConfig.js
 ├── models/
 │   ├── userModel.js
 │   ├── cartModel.js
 │   ├── productModel.js
 │   ├── orderModel.js
 │   └── paymentModel.js
 ├── controllers/
 │   ├── cartController.js
 │   ├── orderController.js
 │   ├── paymentController.js
 │   └── authController.js
 ├── routes/
 │   ├── cartRoutes.js
 │   ├── orderRoutes.js
 │   ├── paymentRoutes.js
 │   └── authRoutes.js
 ├── utils/
 │   ├── razorpaySignatureVerificationUtil.js
 │   ├── email.utils.js
 │   └── response.utils.js
 └── app.js

🧪 Testing

You can use Postman or Thunder Client to test the APIs.

Example endpoints:

POST /api/auth/register

POST /api/auth/login

GET /api/cart

POST /api/orders/create

POST /api/payments/webhook

🛡️ Environment & Security Notes

Never commit .env to version control.

Use strong JWT secrets and production Razorpay credentials in live environments.

Enable HTTPS for webhooks in production.

👨‍💻 Author

Your Name
Full Stack Developer | Node.js | React | PostgreSQL
📧 munipallegopikrishna@gmail.com

🌐 https://www.linkedin.com/in/leelagopikrishna/

```bash
