# PakTech

PakTech is an e-commerce website for tech accessories. Customers can browse products, view product details, and place orders through WhatsApp. The project also includes an admin dashboard for managing products, categories, orders, and coupons from the same application.

Live website: **https://paktech-nine.vercel.app**

## Built With

* Next.js
* React
* TypeScript
* Tailwind CSS
* Firebase Authentication
* Firestore
* Cloudinary
* Zustand

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

## Admin Login

Go to:

```
/account/login
```

or

```
/admin
```

Default credentials:

Email:

```
pktech190@gmail.com
```

Password:

```
admin123
```

These values can be changed in `.env.local`.

## Main Features

* Responsive design
* Light and dark mode
* Firebase authentication
* Google Sign In
* Product categories
* Product search
* Product details page
* Shopping cart
* Wishlist
* WhatsApp ordering
* Coupon support
* Admin dashboard
* Product management
* Category management
* Order management
* Image upload with Cloudinary

## Project Structure

```
app/
├── admin/
├── api/
├── account/

components/
├── admin/
├── ui/

lib/
├── auth/
├── db/
├── services/

store/
public/
```

## Available Scripts

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Seed Firestore:

```bash
npm run seed:firestore
```

## Deployment

The project is deployed on Vercel.

Live URL:

https://paktech-nine.vercel.app

For your own deployment, add the required Firebase and Cloudinary environment variables before building the project.

## Notes

* Do not commit `.env.local`.
* Keep Firebase service account credentials private.
* Configure production environment variables through your hosting provider.

## Developed by 

Muhammad Abdullah Munawar

## License

This project was created for learning and portfolio purposes.
