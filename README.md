# PakTech — Premium Tech Accessories Store

PakTech is a modern premium e-commerce platform for tech accessories built with a fully integrated Admin Dashboard. The storefront and admin panel run within the same application, making product management fast and seamless.

## 🌐 Live Website

**Store:** https://paktech-nine.vercel.app

---

## ✨ Features

### Customer Store

* Modern responsive UI
* Light & Dark mode
* Product categories
* Product search
* Product details page
* Shopping cart
* Wishlist
* Secure authentication
* Google Sign-In (Firebase)
* WhatsApp ordering
* Coupon code support
* Mobile-friendly design

### Admin Dashboard

* Secure admin authentication
* Dashboard analytics
* Add/Edit/Delete products
* Upload product images
* Manage categories
* Manage orders
* Manage coupons
* Customer management
* Inventory management

Changes made in the admin dashboard are reflected instantly on the store.

---

## 🚀 Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Firebase Authentication
* Firestore Database
* Cloudinary Image Storage
* Zustand
* Vercel Deployment

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/abdullahaieng/PAKTECH.git
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 🔐 Admin Login

Login from

```
/account/login
```

or visit

```
/admin
```

Default credentials

Email

```
pktech190@gmail.com
```

Password

```
admin123
```

You can change these inside

```
.env.local
```

```env
ADMIN_EMAIL=pktech190@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_SECRET=your-secret-key
```

---

## 📁 Project Structure

```
paktech/
│
├── app/
│   ├── admin/
│   ├── api/
│   ├── account/
│   └── (store pages)
│
├── components/
│   ├── admin/
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── admin/
│   ├── db/
│   └── services/
│
├── store/
├── public/
└── styles/
```

---

## 🔄 Data Flow

```
Customer Order
        │
        ▼
POST /api/orders
        │
        ▼
Firestore Database
        │
        ▼
Admin Dashboard
        │
        ▼
Order Management
```

Product updates made from the Admin Dashboard are reflected immediately on the storefront.

---

## 🎁 Coupon Codes

* PAKTECH10
* WELCOME15
* FLASH20

---

## 📦 Deployment

The application is deployed on **Vercel**.

**Live URL**

https://pktech-nine.vercel.app

To deploy your own version:

1. Fork this repository.
2. Import the project into Vercel.
3. Configure the required environment variables.
4. Deploy.

---

## 🔥 Environment Variables

```
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SECRET=

FIRESTORE_ENABLED=true

FIREBASE_SERVICE_ACCOUNT_JSON=
```

Never commit your `.env.local` or Firebase credentials.

---

## 📜 Available Scripts

```bash
npm run dev
```

Start development server.

```bash
npm run build
```

Create production build.

```bash
npm run lint
```

Run ESLint.

```bash
npm run check
```

Run project checks.

```bash
npm run seed:firestore
```

Seed Firestore database.

---

## 🛡️ Security

* Environment variables are excluded from version control.
* Firebase credentials are stored securely.
* Admin authentication is protected.
* Production secrets should be configured through Vercel Environment Variables.

---

## 📄 License

This project is intended for educational and portfolio purposes.

---

## 👨‍💻 Developed by

**Abdullah**

PakTech — Premium Tech Accessories Store

🌐 https://pktech-nine.vercel.app
